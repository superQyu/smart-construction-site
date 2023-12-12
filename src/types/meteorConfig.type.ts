export interface MeteorConfigItf {
    config?: any;
    originConfigArr?: string[];
    configPath?: string;
    backupPath?: string | null;
    writeConfigFunc?: (config?: any) => Promise<void>;
    restoreFunc?: () => void;
    setConfigFunc?: (config?: any) => void
}
