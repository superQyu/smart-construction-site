import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { readTextFile, writeTextFile } from '@tauri-apps/api/fs';
import { parse, stringify } from 'ini';
import dayjs from 'dayjs';

import { invoke } from '@tauri-apps/api/tauri';

import { MeteorConfigItf } from '@/types/meteorConfig.type';
import apis from '@/apis';
import { global } from '@/config';

const meteorConfigContext = createContext<MeteorConfigItf | undefined>(undefined);

export const useMeteorConfigContext = () => {
  const context = useContext(meteorConfigContext);
  if (!context) {
    throw new Error('useMeteorConfigContext must be used within a MeteorConfigProvider');
  }
  return context;
};

const writeFileWrapper = async (filePath: string, config: any, writeToPath?: string) => {
  console.log('stringfiy=>', stringify(config));
  return invoke('write_config_to_file', {
    filePath: filePath,
    config: stringify(config),
  }).then((res: unknown) => {
    return writeTextFile({
      path: writeToPath || filePath,
      contents: (res as any as string).replaceAll('\\"', '').replaceAll('\\\\', '\\'),
    });
  });
};

export function MeteorConfigContextProvider({ children }: { children: ReactNode }) {
  const [configFile, setConfigFile] = useState<MeteorConfigItf>({ config: null });

  useEffect(() => {
    apis.printerEngine.queryConfigPath().then((filePath) => {
      readTextFile(filePath).then((res) => {
        const config = parse(res);
        const originConfigArr = res.split('\r\n');

        setConfigFile({
          config: config,
          originConfigArr: originConfigArr,
          configPath: filePath,
          backupPath: localStorage.getItem(global.BACKUP_PATH_KEY) || '',
          writeConfigFunc: (configParam: any) => {
            console.log('write=>', configParam || config);

            setConfigFile((prev) => ({ ...prev, config: configParam || config }));

            const enableBackup = localStorage.getItem(global.ENABLE_BACKUP) === 'true';
            const backupPath = localStorage.getItem(global.BACKUP_PATH_KEY);
            if (enableBackup && backupPath) {
              writeFileWrapper(
                filePath,
                configParam || config,
                `${backupPath}\\${dayjs().format('YYYY_MM_DD HH_mm_ss')}_backup.cfg`,
              );
            }

            return writeFileWrapper(filePath, configParam || config);
          },
          restoreFunc: () => {
            setConfigFile((prev) => ({
              ...prev,
              config: { ...parse(res) },
            }));
          },
          setConfigFunc: (configParam: any) => {
            setConfigFile((prev) => ({ ...prev, config: configParam || config }));
          },
        });
      });
    });
  }, []);

  return <meteorConfigContext.Provider value={configFile}>{children}</meteorConfigContext.Provider>;
}
