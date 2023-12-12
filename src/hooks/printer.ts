import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AxiosError } from 'axios';

import { useSnackbar } from '@/context/SnackbarContext';
import { useMeteorConfigContext } from '@/context/MeteorConfigContext'
import { generateRandomId, pixelToMm, mmToPixel } from '@/utils'
import { global } from '@/config'

import type {
    PrintHeadInfoData,
    PrintHeadInfoItf,
    PrintPCCInfoData,
    PDCSettingsInContext,
    PrintPlaneInfo,
    NozzleCompensationItf,
    PlaneTemperatureContractionItf,
    ColorPlaneInContext,
    PrintConfigSystemInfo,
    PrintHeadSystemInfo,
    SystemSettingContext,
    PrintProductDetectItf,
    PrintAutoSpitItf,
    DataPathModeItf,
    PrintImageStoreItf,
    SettingPaneItf,
    PlaneOffsetItf,
    HeadSettingCtx
} from '@/types';
export function usePrinterError() {

    const { t } = useTranslation();
    const { showSnackbar } = useSnackbar();

    const handleERet = (eRet: number, operate?: string) => {
        switch (eRet) {
            case 0:
                showSnackbar({
                    message: t('error.eret.0', '{{operate}}操作成功', {
                        operate: operate || ''
                    }).toString(),
                    severity: 'success',
                    duration: 5000,
                });
                return
            case 5:
                showSnackbar({
                    message: t('error.eret.5', '请先启动打印机再执行操作').toString(),
                    severity: 'info',
                    duration: 1000,
                });
                return
            case 6:
                showSnackbar({
                    message: t('error.eret.6', '已执行{{operate}}操作', {
                        operate: operate || ''
                    }).toString(),
                    severity: 'info',
                    duration: 1000,
                });
                return
            case 14:
                showSnackbar({
                    message: t('error.eret.14', '打印机繁忙请稍等5分钟再尝试').toString(),
                    severity: 'warning',
                    duration: 1000,
                });
                return
            case 18:
                showSnackbar({
                    message: t('error.eret.18', '引擎没有启动').toString(),
                    severity: 'warning',
                    duration: 1000,
                });
                return
            default:
                showSnackbar({
                    message: t('error.eret.unknown', '未知错误').toString(),
                    severity: 'error',
                    duration: 1000,
                });
                return
        }
    }
    const handleAppError = (err: AxiosError) => {
        showSnackbar({
            message: `${t('error.appError', '启动失败')}: ${err.message}`,
            severity: 'error',
            duration: 1000,
        });
    }


    return {
        handleERet,
        handleAppError
    }
}


export function useInitSettingPane(cb: (data: SettingPaneItf) => void) {
    const { config } = useMeteorConfigContext()
    useEffect(() => {
        if (config) {
            const xOffset = config.Application?.ImageXOffsets?.split(',') || [];
            const yOffset = config.Application?.ImageYOffsets?.split(',') || [];
            const headType = config.System?.HeadType || config?.System?.SubSys1?.HeadType
            const xdpi = parseFloat(config[headType]?.Xdpi || config[headType]?.SubSys1?.Xdpi || '0')

            cb({
                folderPath: localStorage.getItem(global.BACKUP_PATH_KEY) || '',
                enableBackup: localStorage.getItem(global.ENABLE_BACKUP) === 'true',
                planeOffsetTable: [
                    ...new Array(parseInt(config.Application.ConfiguredPlaneCount) || 0).fill(0).map((_, idx: number) => {
                        const _xOffset = xOffset.length > idx ? parseFloat(xOffset[idx]) : 0.0;
                        const _yOffset = yOffset.length > idx ? parseFloat(yOffset[idx]) : 0.0;
                        return {
                            id: idx,
                            planeNum: idx + 1,
                            label: config.Application[`PlaneName${idx + 1}`] || `Plane ${idx + 1}`,
                            x: _xOffset,
                            y: _yOffset,
                        } as PlaneOffsetItf;
                    }),
                ],
                hotFolder: config?.Application?.HotFolder?.replaceAll('"', '') || '',
                imageX: config?.Application?.ImageX || 0,
                imageY: config?.Application?.ImageY || 0,
                hotFolderAutoRefresh: config?.Application?.HotFolderAutoRefresh === '1',
                pageDelimiters: config.Application.PageDelimiters,
                canPrintBmpFiles: config.Application.CanPrintBmpFiles,
                firstScanInJobIsForward: config.Application?.IsFirstScanForwards === '1',
                biDirectionScan: config.Application?.IsBiDirectionalScanning === '1',
                reversePassXAdjust: parseFloat(pixelToMm(parseFloat(config?.Encoder?.ReverseXadjust || '0'), xdpi).toFixed(2)),
                enableImageXExtend: config.Application?.UseSinglePassScanning === '1',
                xdpi: xdpi
            })
        }

    }, [config])
}

interface InitPrintHeadOption {
    withVoltage?: boolean
}

type HeadInfoCallback = (data: PrintHeadInfoItf[]) => void

export function useInitHeadInfo(cb: HeadInfoCallback, options?: InitPrintHeadOption) {
    const { config } = useMeteorConfigContext()
    const { t } = useTranslation();
    const [headInfo, setHeadInfo] = useState<PrintHeadInfoItf[] | null>(null)

    function handlePlaneValue(value: string) {
        const pccHeadPairArr = value.split(',').map((item) => item.trim());
        return pccHeadPairArr.map((item) => {
            const [pccNum, headNum, channel] = item.split(':');
            return {
                pccNum: parseInt(pccNum),
                headNum: parseInt(headNum),
                channel: parseInt(channel || '0')
            };
        });
    }

    function getColorByName(name: string): {
        color: string
        title: string
        subTitle?: string
        name: string
    } {
        switch (name.replaceAll("\"", "")) {
            case 'C':
                return {
                    name: name,
                    title: t('common.cyan', '青色'),
                    subTitle: '(C)',
                    color: '#22cba2',

                }
            case "M":
                return {
                    name: name,
                    title: t('common.pinkish', '品红'),
                    subTitle: '(M)',
                    color: '#ff5b62',
                }
            case "Y":
                return {
                    name: name,
                    title: t('common.yellow', '黄色'),
                    subTitle: '(Y)',
                    color: '#ffdc46',

                }
            case "K":
                return {
                    name: name,
                    title: t('common.black', '黑色'),
                    subTitle: '(K)',
                    color: '#313131',
                }
            case "W":
                return {
                    name: name,
                    title: t('common.white', '白色'),
                    subTitle: '(W)',
                    color: '#fff',
                }
            case "LC":
                return {
                    name: name,
                    title: t('common.lightCyan', '浅青色'),
                    subTitle: '(LC)',
                    color: '#8ae2cc',
                }
            case "LM":
                return {
                    name: name,
                    title: t('common.lightPinkish', '浅品红'),
                    subTitle: '(LM)',
                    color: '#fdaeb4',

                }
            case "LK":
                return {
                    name: name,
                    title: t('common.lightBlack', '浅黑色'),
                    subTitle: '(LK)',
                    color: '#7b7b7b',
                }
            case "LLK":
                return {
                    name: name,
                    title: t('common.lightLightBlack', '浅浅黑'),
                    subTitle: '(LLK)',
                    color: '#c2c2c2',
                }
            default:
                return { color: '#313131', title: name, name: name, }
        }
    }

    function generateVoltage(pcc: number, pccPosition: number) {
        return config?.[`Head${pcc}:${pccPosition}`]?.WF_VScale_Coeff?.split(',').map((item: string) => parseFloat(((parseFloat(item || '1') - 1) * 100).toFixed(2)))
    }

    function generateHeadPlane(headInfoArr: PrintHeadInfoItf[], k: string, planeObj: any) {
        const val = planeObj[k];
        const planeNum = parseInt(k?.match(/^Plane(\d+)$/)?.[1] || '-1', 10);
        if (planeNum >= 1) {
            const newHead: PrintHeadInfoItf = {
                ...getColorByName(config.Application[`PlaneName${planeNum}`] || `${t('common.plane', '通道')}${planeNum}`),
                id: generateRandomId(),
                data: [],
                planeNum: planeNum,
                planesPerHDC: parseInt(planeObj?.PlanesPerHDC || '1'),
                setExtension: (head: PrintHeadInfoItf, pccInfoArr?: PrintPCCInfoData[]) => {
                    const disabledHead = config.Application?.HeadDataDisable?.split(',') || []
                    head.data = head.data?.map((item) => {
                        let xdpi = 0;
                        const idx = pccInfoArr?.findIndex(info => info.pccNum === item.pcc) ?? -1
                        if (idx >= 0) {
                            xdpi = pccInfoArr?.[idx].xdpi || 0
                        }

                        return {
                            ...item,
                            xdpi: xdpi,
                            xOffset: parseFloat(pixelToMm(parseFloat(config[`Controller${item.pcc}`]?.Xoffsets?.split(',')[item.pccPosition - 1] || '0'), xdpi).toFixed(2)), // pixel to mm
                            yOffset: parseFloat(config[`Controller${item.pcc}`]?.Yoffsets?.split(',')[item.pccPosition - 1] || '0'),
                            droppedActiveNozzlesTop: parseInt(config[`Controller${item.pcc}`]?.DroppedActiveNozzlesTop?.split(',')[item.pccPosition - 1] || '0'),
                            droppedActiveNozzlesEnd: parseInt(config[`Controller${item.pcc}`]?.DroppedActiveNozzlesEnd?.split(',')[item.pccPosition - 1] || '0'),
                            orientation: parseInt(config[`Controller${item.pcc}`]?.Orientations?.split(',')[item.pccPosition - 1] || '0') === 0 ? false : true,
                            enabled: !disabledHead.some((dh: string) => dh.startsWith(`${item.pcc}:${item.pccPosition}`)),
                            stitchAdjust: 0,
                            stitchBalance: 0
                        }
                    })

                    return head
                }
            }

            handlePlaneValue(val).map((item) => {
                newHead.pcc = newHead.pcc ? [...newHead.pcc, item.pccNum] : [item.pccNum];
                if (item.headNum <= global.MAX_PCC_HEAD_COUNT && newHead.data) {
                    newHead.data.push({
                        id: generateRandomId(),
                        order: newHead.data.length + 1,
                        pcc: item.pccNum,
                        pccPosition: item.headNum,
                        channel: item.channel,
                        temperature: 0,
                        color: newHead.color,
                        planeNum: planeNum,
                        planeName: newHead.name,
                        voltages: options?.withVoltage ? generateVoltage(item.pccNum, item.headNum) : undefined
                    });
                }

            });


            headInfoArr.push(newHead);
        }
    }

    useEffect(() => {
        if (config) {
            const headInfoArr: PrintHeadInfoItf[] = []
            for (const k of Object.keys(config.Planes || {})) {
                if (/SubSys\d+/.test(k)) {
                    for (const innerK of Object.keys(config.Planes[k])) {
                        if (/^Plane(\d+)$/.test(innerK))
                            generateHeadPlane(headInfoArr, innerK, config.Planes[k])
                    }
                    continue
                }

                if (/^Plane(\d+)$/.test(k)) {
                    generateHeadPlane(headInfoArr, k, config.Planes)

                }
            }
            headInfoArr.sort((a: PrintHeadInfoItf, b: PrintHeadInfoItf) => a.planeNum - b.planeNum)
            cb(headInfoArr)
            setHeadInfo(headInfoArr)

        }
    }, [config]);

    return [headInfo, setHeadInfo]
}

// eslint-disable-next-line no-unused-vars
type PccInfoCallback = (data: PrintPCCInfoData[]) => void
export function useInitPccInfo(cb: PccInfoCallback) {
    const { config } = useMeteorConfigContext()
    const [pccInfo, setPccInfo] = useState<PrintPCCInfoData[] | null>(null)

    const isMixSubsystem = (enableMixSubsystem: boolean) => enableMixSubsystem && Object.keys(config['System']).some((item: string) => /SubSys\d+/.test(item))

    const getSystemInfo = (enableMixSubsystem: boolean, order: number) => {
        if (!isMixSubsystem(enableMixSubsystem)) {
            return config.System
        }

        return config.System?.[`SubSys${order}`]
    }

    const getHeadTypeInfo = (enableMixSubsystem: boolean, headType: string, order: number) => {
        if (!isMixSubsystem(enableMixSubsystem)) {
            return config[headType]
        }

        return config[headType]?.[`SubSys${order}`]

    }

    const getPlaneInfo = (enableMixSubsystem: boolean, order: number) => {
        if (!isMixSubsystem(enableMixSubsystem)) {
            return config.Planes
        }
        return config.Planes?.[`SubSys${order}`]
    }


    useEffect(() => {
        if (config) {
            const enableMixSubsystem = !!config.System?.SubSys1
            const pccArr: PrintPCCInfoData[] = new Array(parseInt(config.Application?.UserPccCount || '0') || Object.keys(config['System']).length).fill({
                disableAllExceptMaster: true,
                master: false
            }).map((item, idx) => ({
                ...item,
                name: `PCC${idx + 1}`
            }))

            let masterCount = 0
            // scene2: 1) enable subSys and with single subSys 2) disable subSys
            const results = pccArr.map((_: PrintPCCInfoData, idx: number) => {
                const master = parseInt(config[`Controller${idx + 1}`]?.Master || '0') >= 1
                if (master) {
                    masterCount++
                }
                const systemInfo = getSystemInfo(enableMixSubsystem, masterCount)
                const headType = systemInfo?.HeadType || ""

                const headTypeInfo = getHeadTypeInfo(enableMixSubsystem, headType, masterCount)
                const xdpi = parseFloat(config[`Controller${idx + 1}`]?.Xdpi || headTypeInfo?.Xdpi || '0')

                const planeInfo = getPlaneInfo(enableMixSubsystem, masterCount);
                return {
                    name: `PCC${idx + 1}`,
                    pccNum: idx + 1,
                    master: master,
                    disableAllExceptMaster: !master,
                    headType: headType,
                    pccType: systemInfo?.PccType,
                    encoderMultiplier: parseInt(config[`Controller${idx + 1}`]?.EncoderMultiplier || config.Encoder?.Multiplier || '0'),
                    encoderDivider: parseInt(config[`Controller${idx + 1}`]?.EncoderDivider || config.Encoder?.Divider || '0'),
                    encoderInvert: parseInt(config[`Controller${idx + 1}`]?.EncoderInvert || config.Encoder?.Invert || '0') >= 1,
                    xdpi: xdpi,
                    planesPerHDC: parseInt(planeInfo?.PlanesPerHDC || '1'),
                    pdOffset: parseFloat(pixelToMm(parseFloat(config[`Controller${idx + 1}`]?.PdOffset || config.ProductDetect?.Xoffset || '0'), xdpi).toFixed(2)),
                    rightToLeft: parseInt(config[`Controller${idx + 1}`]?.RightToLeft || systemInfo?.RightToLeft || '0') >= 1,
                    disabledMaster: idx === 0,
                    disabledHeadType: !enableMixSubsystem && idx !== 0,
                    disabledPccType: !enableMixSubsystem && idx !== 0,
                    disableRightToLeft: !enableMixSubsystem && idx !== 0,
                    disableXdpi: !enableMixSubsystem && idx !== 0
                }
            })

            setPccInfo(results)
            return cb(results)

        }

    }, [config])

    return [pccInfo, setPccInfo]
}

/**
 * 
 * @param pccData 
 * @param headInfoArr 
 * @param pccIdx: pcc index
 * @returns 
 */
export function setSingleHeadInfoOnPccInfo(pccData: PrintPCCInfoData, headInfoArr: PrintHeadInfoItf[], pccIdx: number) {
    const planesPerHDC = pccData.planesPerHDC || 1;
    const newHeadInfo = new Array<PrintHeadInfoData | undefined>(global.MAX_PCC_HEAD_COUNT * planesPerHDC).fill(undefined).map((_, index) => ({
        pcc: pccIdx + 1,
        pccPosition: (Math.floor(index / planesPerHDC) + 1),
        planeNum: 0,
        channel: planesPerHDC > 1 ? (index % planesPerHDC) + 1 : 0,
        planeName: 'Head Not Fitted'
    } as PrintHeadInfoData))

    headInfoArr
        .map((item: PrintHeadInfoItf) => item.data || [])
        .flat()
        .filter((headInfo: PrintHeadInfoData) => headInfo?.pcc === pccIdx + 1)
        .map((headInfo: PrintHeadInfoData) => {
            newHeadInfo[(headInfo.pccPosition - 1) * planesPerHDC + (headInfo.channel || 1) - 1] = headInfo
        })

    return {
        ...pccData,
        headInfo: newHeadInfo
    }
}


export function usePlaneNames(cb: (data: string[]) => void) {

    const { config } = useMeteorConfigContext()
    useEffect(() => {
        if (config) {
            const planeNameArr: string[] = []
            for (const k of Object.keys(config.Application || {})) {
                if (/PlaneName\d+/.test(k) && config?.Application?.[k]) {
                    planeNameArr.push(config.Application[k])
                }
            }

            cb(planeNameArr)
        }
    }, [config])
}

export function useIsEnableIndependentPrintLane(cb: (data: boolean) => void) {
    const { config } = useMeteorConfigContext()
    useEffect(() => {
        if (config) {
            cb(!!config.Planes?.SubSys2?.SubsysPrintLane)
        }
    }, [config])
}

export function useIsEnableMixSubsystem(cb: (data: boolean) => void) {
    const { config } = useMeteorConfigContext()
    useEffect(() => {
        if (config) {
            cb(!!config.System?.SubSys1)
        }
    }, [config])
}

export function useInitYinterlace(cb: (data: string) => void) {
    const { config } = useMeteorConfigContext()
    useEffect(() => {
        const yinterlace = config?.Planes?.Yinterlace || config?.Planes?.SubSys1?.Yinterlace || '1'
        cb(yinterlace)

    }, [config])
}

export function useInitConfigSystemInfo(cb: (data: PrintConfigSystemInfo[]) => void) {
    const { config } = useMeteorConfigContext()
    useEffect(() => {
        if (config) {
            const arr: PrintConfigSystemInfo[] = []
            if (Object.keys(config.System).some(key => /SubSys\d+/.test(key))) {
                for (const key of Object.keys(config.System || {})) {
                    if (/SubSys\d+/.test(key)) {
                        arr.push({
                            systemOrder: parseInt(key.match(/SubSys(\d+)/)?.[1] || '0'),
                            headType: config.System[key].HeadType,
                            rightToLeft: config.System[key].RightToLeft === '1',
                            pccType: config.System[key].PccType
                        })
                    }
                }
            } else {
                arr.push({
                    systemOrder: 0,
                    headType: config.System.HeadType,
                    rightToLeft: config.System.RightToLeft === '1',
                    pccType: config.System.PccType
                })
            }
            cb(arr)
        }

    }, [config])
}

export function useInitPrintHeadSystemInfo(cb: (data: PrintHeadSystemInfo[]) => void) {
    const { config } = useMeteorConfigContext()
    useInitConfigSystemInfo((systemInfoArr) => {
        if (config) {
            const arr: PrintHeadSystemInfo[] = []
            systemInfoArr.map(item => {
                const obj = item.systemOrder ? config?.[item.headType as string]?.[`SubSys${item.systemOrder}`] || {} : config?.[item.headType as string]
                arr.push({
                    xdpi: parseFloat(obj?.Xdpi || '0'),
                    bitsPerPixel: obj?.BitsPerPixel,
                    headType: item.headType,
                    systemOrder: item.systemOrder
                })
            })
            cb(arr)
        }


    })
}

interface PlaneInfoExtenstion {
    nozzleCompensation?: boolean;
    dropSizes?: boolean;
    temperatureContraction?: boolean;
}

export function useInitPlaneInfo(cb: (data: PrintPlaneInfo[]) => void, count: number, extend?: PlaneInfoExtenstion) {
    const { config } = useMeteorConfigContext()
    useEffect(() => {
        if (config) {
            const arr = new Array<PrintPlaneInfo>(count || 0).fill({}).map((_, idx: number) => {
                return {
                    order: idx + 1,
                    name: config.Application[`PlaneName${idx + 1}`],
                    temperature: 0,
                    waveForm: '',
                    nozzleCompensation: extend?.nozzleCompensation && generateNozzleCompensation(idx + 1),
                    dropSizes: extend?.dropSizes && generateDropSizes(idx + 1),
                    temperatureContraction: extend?.temperatureContraction ? generateTemperatureContraction(idx + 1, 1) : undefined
                } as PrintPlaneInfo
            })

            for (const k of Object.keys(config.Planes)) {
                if (/SubSys\d+/.test(k)) {
                    for (const innerK of Object.keys(config.Planes[k])) {
                        const planeNumMatch = innerK.match(/Plane(\d+)/)
                        if (planeNumMatch) {
                            const order = parseInt(planeNumMatch[1])
                            const systemOrder = parseInt(k.match(/SubSys(\d+)/)?.[1] || '0')
                            if (order <= count) {
                                arr[order - 1] = {
                                    ...arr[order - 1],
                                    system: systemOrder,
                                    pcc: generatePccInfo(config.Planes[k][innerK]),
                                    waveForm: generateWaveForm(order, systemOrder),
                                    temperatureContraction: extend?.temperatureContraction ? generateTemperatureContraction(order, systemOrder) : undefined
                                }
                            }

                        }
                    }
                } else {
                    const planeNumMatch = k.match(/Plane(\d+)/)
                    if (planeNumMatch) {
                        const order = parseInt(planeNumMatch[1])
                        if (order <= count) {
                            arr[order - 1] = {
                                ...arr[order - 1],
                                pcc: generatePccInfo(config.Planes[k]),
                                waveForm: generateWaveForm(order),
                                temperatureContraction: extend?.temperatureContraction ? generateTemperatureContraction(order) : undefined
                            }

                        }

                    }
                }
            }
            cb(arr)
        }
    }, [config, count])

    // str: 3:1,4:2
    const generatePccInfo = (str: string) => {
        return (str.split(',') || [])
    }

    const generateWaveForm = (planeOrder: number, systemOrder?: number) => {
        let headType = config.System.HeadType
        if (systemOrder) {
            headType = config.System[`SubSys${systemOrder}`].HeadType
        }

        let waveForm = config[headType]?.[`Waveform${20 + planeOrder}`] || ''
        if (systemOrder) {
            waveForm = config[headType]?.[`SubSys${systemOrder}`]?.[`Waveform${20 + planeOrder}`] || ''
        }

        return waveForm.replaceAll('"', '')

    }

    const generateNozzleCompensation = (planeOrder: number): NozzleCompensationItf => {
        return {
            interPlaneYOffset: parseInt(config?.NozzleCompensation?.InterPlaneYOffset?.split(',')?.[planeOrder - 1] || '0'),
            samePlaneMode: config?.NozzleCompensation?.SamePlaneMode?.split(',')?.[planeOrder - 1] || '0',
            sampleExtentVertical: parseInt(config?.NozzleCompensation?.SampleExtentVertical?.split(',')?.[planeOrder - 1]) || 1,
            sampleExtentHorizontal: parseInt(config?.NozzleCompensation?.SampleExtentHorizontal?.split(',')?.[planeOrder - 1] || '0'),
        }
    }

    const generateDropSizes = (planeNum: number) => {
        const dropSizesArr = config.Application[`DropSizesPlane${planeNum}`]?.split(',').map((v: string) => parseFloat(v || '0')) || [0.0, 0.0, 0.0, 0.0]
        return {
            gl1: dropSizesArr[1],
            gl2: dropSizesArr[2],
            gl3: dropSizesArr[3]
        }

    }

    const generateTemperatureContraction = (planeNum: number, systemOrder?: number): PlaneTemperatureContractionItf => {

        let headType = config.System.HeadType
        if (systemOrder) {
            headType = config.System?.[`SubSys${systemOrder}`]?.HeadType || headType
        }

        let xdpi = parseFloat(config[headType]?.Xdpi || config.Application?.Xdpi || '0')
        if (systemOrder) {
            xdpi = parseFloat(config[headType]?.[`SubSys${systemOrder}`]?.Xdpi || '0') || xdpi
        }

        let ydpi = config.Planes.Yinterlace === '2' ? 1200 : 600
        if (systemOrder && config.Planes[`SubSys${systemOrder}`]) {
            ydpi = config.Planes[`SubSys${systemOrder}`]?.Yinterlace === '2' ? 1200 : 600
        }

        const tileEdgeContractionXPx = parseFloat(config.TemperatureContraction?.TileEdgeContractionXPx?.split(',')[planeNum - 1] || '0')
        const tileEdgeContractionYPx = parseFloat(config.TemperatureContraction?.TileEdgeContractionYPx?.split(',')[planeNum - 1] || '0')
        const tileCornerContractionXPx = parseFloat(config.TemperatureContraction?.TileCornerContractionXPx?.split(',')[planeNum - 1] || '0')
        const tileCornerContractionYPx = parseFloat(config.TemperatureContraction?.TileCornerContractionYPx?.split(',')[planeNum - 1] || '0')

        return {
            xdpi,
            ydpi,
            tileEdgeContractionXPx: parseFloat(pixelToMm(tileEdgeContractionXPx, xdpi).toFixed(2)),
            tileEdgeContractionYPx: parseFloat(pixelToMm(tileEdgeContractionYPx, ydpi).toFixed(2)),
            tileCornerContractionXPx: parseFloat(pixelToMm(tileCornerContractionXPx, xdpi).toFixed(2)),
            tileCornerContractionYPx: parseFloat(pixelToMm(tileCornerContractionYPx, ydpi).toFixed(2)),
        }
    }
}

export function useInitPdTrigger(cb: (data: PrintProductDetectItf) => void) {
    const { config } = useMeteorConfigContext()
    useEffect(() => {
        if (config) {
            const headType = config?.System?.HeadType || config.System?.SubSys1?.HeadType;
            const xdpi = config[headType]?.Xdpi || config[headType]?.SubSys1?.Xdpi
            cb({
                xOffset: parseFloat(pixelToMm(parseFloat(config.ProductDetect?.Xoffset || '0'), parseFloat(xdpi || '0')).toFixed(2)), // mm -> pixel
                activeLow: config.ProductDetect?.ActiveLow === '1',
                filter: parseFloat(config.ProductDetect?.Filter || '0'),
                lockout: config.ProductDetect?.Lockout === '1',
                minimumGap: parseFloat(pixelToMm(parseFloat(config.ProductDetect?.MinimumGap || '0'), parseFloat(xdpi || '0')).toFixed(2)),
                xdpi: xdpi
            })

        }
    }, [config])
}

export function useInitAutoSpit(cb: (data: PrintAutoSpitItf) => void) {
    const { config } = useMeteorConfigContext()
    useEffect(() => {
        if (config) {
            cb({
                timeInterval: config.Application.AutoSpitSeconds || 0,
                spitCount: config.Application.AutoSpitCount || 0,
                enableTimeInterval: config.Application.IsAutoSpitSecondsActive === '1'
            })
        }
    }, [config])
}

export function useInitDataPathMode(cb: (data: DataPathModeItf) => void) {

    const { config } = useMeteorConfigContext()
    const checkMode = () => {
        if (config.Application.UseFifoDatapath === '1') {
            return 'fifo'
        }

        if ((config.Application.UseSinglePassScanning) === '1')
            return 'singlePassScan'

        return 'imageStore'
    }
    useEffect(() => {
        if (config) {
            cb({
                mode: checkMode(),
                fifoRightAlign: config.Application.FifoRightAlign === '1',
                lookaheadCmdCount: parseInt(config.Application.LookaheadCmdCount || '0')
            })
        }
    }, [config])
}

export function useInitImageStore(cb: (data: PrintImageStoreItf) => void) {
    const { config } = useMeteorConfigContext()
    useEffect(() => {
        if (config) {
            const directDDRAMAccess = config.SimFlash.DirectDDRAMAccess === '1';
            const simFlashSizeBlocks = (parseInt(config.SimFlash.SimFlashSizeBlocks) || parseInt(localStorage.getItem(global.SIM_FlASH_SIZE_BLOCKS) || '0')) / 2 / 1024 / 1024;
            const headType = config?.System?.HeadType || config.System?.SubSys1?.HeadType;
            const xdpi = config[headType]?.Xdpi || config[headType]?.SubSys1?.Xdpi;

            cb({
                directDDRAMAccess: directDDRAMAccess,
                simFlashSizeBlocks: simFlashSizeBlocks,
                enablePCCFlashCard: !directDDRAMAccess && simFlashSizeBlocks <= 0,
                enableVirtualCF: !directDDRAMAccess && simFlashSizeBlocks > 0,
                maxTileXLengthPixels: parseInt(pixelToMm(parseFloat(config.Application.MaxTileXLengthPixels || '0'), parseFloat(xdpi || '0')).toFixed(0)),
                maxJobSetCFMemoryPercent: parseInt(config.Application.MaxJobSetCFMemoryPercent || '0'),
                clearImageStoreOnYOffsetChange: config.Application.ClearImageStoreOnYOffsetChange === '1',
                xdpi: xdpi
            })
        }
    }, [config])
}

export function pdcSettingParser(pdcSettingData: PDCSettingsInContext, config: any) {
    if (!pdcSettingData || !config) {
        return config
    }
    const isMultiSubsystem = (pdcSettingData.pccAggregateTable?.filter((item) => item.master) || []).length >= 1;

    // setting pcc count
    if (pdcSettingData.PCCMotherboardCount) {
        config.Application.UserPccCount = pdcSettingData.PCCMotherboardCount

        // clear controller
        for (const k in config) {
            const idx = parseInt(k.match(/Controller(\d+)/)?.[1] || '0');
            if (idx > pdcSettingData.PCCMotherboardCount) {
                delete config[k]
            }

        }
    }

    // setting system && encoder
    let masterCount = 0
    pdcSettingData.pccAggregateTable
        ?.filter((item) => item.master)
        .map((pccInfo: PrintPCCInfoData, idx: number) => {
            if (pdcSettingData.enableMixSubsystem && isMultiSubsystem) {
                if (pccInfo.master) {
                    masterCount++
                }

                config[`${pccInfo.headType}`] = {
                    ...config[`${pccInfo.headType}`],
                    [`SubSys${masterCount}`]: {
                        ...config[`${pccInfo.headType}`]?.[`SubSys${masterCount}`],
                        Xdpi: pccInfo.xdpi,
                        BitsPerPixel: 2
                    }
                };

                config.System[`SubSys${masterCount}`] = {
                    ...config.System[`SubSys${masterCount}`],
                    PccType: pccInfo.pccType,
                    HeadType: pccInfo.headType,
                    RightToLeft: pccInfo.rightToLeft ? 1 : 0,
                };
            } else {
                config[`${pccInfo.headType}`] = {
                    ...config[`${pccInfo.headType}`],
                    Xdpi: pccInfo.xdpi,
                };

                config.System = {
                    ...config.System,
                    PccType: pccInfo.pccType,
                    HeadType: pccInfo.headType,
                    RightToLeft: pccInfo.rightToLeft ? 1 : 0,
                };
            }
            // setting encoder
            if (idx === 0) {
                config.Encoder = {
                    ...config.Encoder,
                    Multiplier: pccInfo.encoderMultiplier,
                    Divider: pccInfo.encoderDivider,
                    Invert: pccInfo.encoderInvert ? 1 : 0
                }
            }
        });

    if (pdcSettingData.pccAggregateTable) {
        // clear SubSys in System
        for (const k of Object.keys(config.System)) {
            if (/SubSys\d+/.test(k)) {
                if (pdcSettingData.enableMixSubsystem) {
                    const order = parseInt(k.match(/SubSys(\d+)/)?.[1] || '0')
                    if (pdcSettingData.enableMixSubsystem && order > masterCount) {
                        delete config.System[k]
                    }
                } else {
                    delete config.System[k]
                }

            }
        }

        // clear SubSys in headType
        pdcSettingData.pccAggregateTable.map((pccInfo: PrintPCCInfoData) => {
            if (!pdcSettingData.enableMixSubsystem) {
                for (const k of Object.keys(config[`${pccInfo.headType}`])) {
                    if (/SubSys\d+/.test(k)) {
                        delete config[`${pccInfo.headType}`][k]
                    }
                }
            }
        })
    }

    // setting headInfo to planes
    const setPlaneInfo = (headInfoData: PrintHeadInfoData, order: number) => {
        const planesPerHDC = config.Planes?.PlanesPerHDC || config.Planes?.SubSys1?.PlanesPerHDC || '1'
        if (pdcSettingData.enableMixSubsystem && isMultiSubsystem) {
            const preStr = `${config.Planes[`SubSys${order}`]?.[`Plane${headInfoData.planeNum}`] || ''}`
            config.Planes[`SubSys${order}`] = {
                ...config.Planes[`SubSys${order}`],
                PlanesPerHDC: planesPerHDC,
                [`Plane${headInfoData.planeNum}`]: `${preStr ? `${preStr},` : ''}${headInfoData.pcc}:${headInfoData.pccPosition}${headInfoData.channel && planesPerHDC === '1' ? `:${headInfoData.channel}` : ""}`,
            }

        } else {
            const preStr = `${config.Planes[`Plane${headInfoData.planeNum}`] || ''}`
            config.Planes[`Plane${headInfoData.planeNum}`] = `${preStr ? `${preStr},` : ''}${headInfoData.pcc}:${headInfoData.pccPosition}${headInfoData.channel ? `:${headInfoData.channel}` : ""}`
        }
    }

    // setting subSysPrintLane to planes
    const setSubSysPrintLaneToPlane = (order: number) => {
        if (pdcSettingData.enableIndependentPrintLane && order >= 2) {
            config.Planes = {
                ...config.Planes,
                [`SubSys${order}`]: {
                    ...config?.Planes[`SubSys${order}`],
                    SubsysPrintLane: order
                }
            }
        } else {
            delete config?.Planes?.[`SubSys${order}`]?.SubsysPrintLane
        }
    }

    if (pdcSettingData.pccAggregateTable) {
        // 1. clear planes for covering plane data
        // 2. clear remained SubSys
        for (const k of Object.keys(config.Planes || {})) {
            if (/SubSys\d+/.test(k)) {
                if (!pdcSettingData.enableMixSubsystem) {
                    delete config.Planes[k]
                } else {
                    for (const innerK of Object.keys(config.Planes[k])) {
                        if (/Plane\d+/.test(innerK)) {
                            delete config.Planes[k][innerK]
                        }
                    }
                }
            } else {
                if (/Plane\d+/.test(k)) {
                    delete config.Planes[k]
                }
            }
        }
    }

    masterCount = 0;
    // setting controller && Head && HeadDriver
    pdcSettingData.pccAggregateTable?.map((pccInfo: PrintPCCInfoData, idx: number) => {
        config[`Controller${idx + 1}`] = {
            ...config[`Controller${idx + 1}`],
            Master: pccInfo.master ? 1 : 0,
        };

        if (pccInfo.master) {
            masterCount++
            setSubSysPrintLaneToPlane(masterCount)
            config[`Controller${idx + 1}`] = {
                ...config[`Controller${idx + 1}`],
                EncoderMultiplier: pccInfo.encoderMultiplier || config?.[`Controller${idx + 1}`]?.EncoderMultiplier,
                EncoderDivider: pccInfo.encoderDivider || config?.[`Controller${idx + 1}`]?.EncoderDivider,
                EncoderInvert: pccInfo.encoderInvert ? 1 : 0,
                PdOffset: mmToPixel(pccInfo.pdOffset || 0, pccInfo.xdpi || 0).toFixed(3),
            };
        }

        pccInfo.headInfo
            ?.filter((item) => item.planeName !== 'Head Not Fitted')
            .map((item: PrintHeadInfoData) => {
                setPlaneInfo(item, masterCount)
                config = {
                    ...config,
                    [`Head${item.pcc}:${item.pccPosition}`]: {
                        ...config[`Head${item.pcc}:${item.pccPosition}`],
                        WF_VScale_Coeff: '1,1,1,1',

                    },
                    [`HeadDriver${item.pcc}:${item.pccPosition}`]: {
                        ...config[`HeadDriver[${item.pcc}:${item.pccPosition}]`],
                        WaveformFileIdx: 20 + item.pcc,
                    }

                }
            });

        // clear Head Not Fitted
        pccInfo.headInfo
            ?.filter((item) => item.planeName === 'Head Not Fitted')
            .map((item: PrintHeadInfoData) => {
                delete config[`Head${item.pcc}:${item.pccPosition}`]
                delete config[`HeadDriver${item.pcc}:${item.pccPosition}`]
            });
    });
    return config;
}

export function colorPlaneParser(colorPlaneData?: ColorPlaneInContext, config?: any) {
    if (!colorPlaneData || !config) return config

    if (colorPlaneData.channelCount) {
        config.Application.ConfiguredPlaneCount = colorPlaneData.channelCount
        const handleImageOffset = (key: 'ImageYOffsets' | 'ImageXOffsets', len: number) => {
            const arrOffset = config.Application?.[key]?.split(',')?.slice(0, len)
            if (arrOffset.length < len) {
                arrOffset.push(...new Array(len - arrOffset.length).fill(0))
            }
            config.Application[key] = arrOffset.join(',')
        }
        const expectedLen = 32 - (16 - colorPlaneData.channelCount)
        handleImageOffset('ImageXOffsets', expectedLen)
        handleImageOffset('ImageYOffsets', expectedLen)
    }

    config.TemperatureContraction = {
        ...config.TemperatureContraction,
        Enabled: colorPlaneData.temperatureContraction ? 1 : 0,
    }

    config.Application.InkEstimationEnabled = colorPlaneData.inkVolumePrediction ? 1 : 0
    config.NozzleCompensation = {
        ...config.NozzleCompensation,
        GlobalEnable: colorPlaneData.orificeCompensation ? 1 : 0
    }
    // setting NozzleCompensation
    const samePlaneModeArr = config.NozzleCompensation?.SamePlaneMode?.split(',') || new Array(32).fill(0)
    const sampleExtentVerticalArr = config.NozzleCompensation?.SampleExtentVertical?.split(',') || new Array(32).fill(0)
    const sampleExtentHorizontalArr = config.NozzleCompensation?.SampleExtentHorizontal?.split(',') || new Array(32).fill(0)


    // setting temperatureContraction
    // setting NozzleCompensation
    const tileEdgeContractionXPx = config.TemperatureContraction?.TileEdgeContractionXPx?.split(',') || new Array(16).fill(0)
    const tileEdgeContractionYPx = config.TemperatureContraction?.TileEdgeContractionYPx?.split(',') || new Array(16).fill(0)
    const tileCornerContractionXPx = config.TemperatureContraction?.TileCornerContractionXPx?.split(',') || new Array(16).fill(0)
    const tileCornerContractionYPx = config.TemperatureContraction?.TileCornerContractionYPx?.split(',') || new Array(16).fill(0)

    colorPlaneData.planeInfoArr?.forEach((planeInfo: PrintPlaneInfo) => {
        // setting WaveForm
        if (planeInfo.pcc && planeInfo.pcc.length > 0 && planeInfo.waveForm) {
            let headType = config.System?.HeadType
            if (planeInfo.system) {
                headType = config.System?.[`SubSys${planeInfo.system}`]?.HeadType
            }

            if (planeInfo.system) {
                config[`${headType}`] = {
                    ...config[`${headType}`],
                    [`SubSys${planeInfo.system}`]: {
                        ...config[`${headType}`]?.[`SubSys${planeInfo.system}`],
                        [`Waveform${20 + (planeInfo.order || 0)}`]: planeInfo.waveForm
                    }
                }
            } else {
                config[`${headType}`] = {
                    ...config[`${headType}`],
                    [`Waveform${20 + (planeInfo.order || 0)}`]: planeInfo.waveForm
                }
            }

            planeInfo.pcc.forEach((pccStr: string) => {
                config[`HeadDriver${pccStr}`] = {
                    ...config[`HeadDriver${pccStr}`],
                    WaveformFileIdx: (planeInfo.order || 0) + 20
                }
            });
        }

        // setting NozzleCompensation
        if (planeInfo.nozzleCompensation && planeInfo.order) {
            samePlaneModeArr[planeInfo.order - 1] = planeInfo.nozzleCompensation.samePlaneMode
            sampleExtentVerticalArr[planeInfo.order - 1] = planeInfo.nozzleCompensation.sampleExtentVertical
            sampleExtentHorizontalArr[planeInfo.order - 1] = planeInfo.nozzleCompensation.sampleExtentHorizontal
        }


        if (planeInfo.dropSizes) {
            const { gl1, gl2, gl3 } = planeInfo.dropSizes
            config.Application[`DropSizesPlane${planeInfo.order}`] = [0, gl1, gl2, gl3, 0, 0, 0, 0].join(',')
        }

        if (planeInfo.temperatureContraction && planeInfo.order) {
            tileEdgeContractionXPx[planeInfo.order - 1] = mmToPixel(planeInfo.temperatureContraction.tileEdgeContractionXPx as number, planeInfo.temperatureContraction.xdpi as number)
            tileEdgeContractionYPx[planeInfo.order - 1] = mmToPixel(planeInfo.temperatureContraction.tileEdgeContractionYPx as number, planeInfo.temperatureContraction.ydpi as number)
            tileCornerContractionXPx[planeInfo.order - 1] = mmToPixel(planeInfo.temperatureContraction.tileCornerContractionXPx as number, planeInfo.temperatureContraction.xdpi as number)
            tileCornerContractionYPx[planeInfo.order - 1] = mmToPixel(planeInfo.temperatureContraction.tileCornerContractionYPx as number, planeInfo.temperatureContraction.ydpi as number)
        }
    })

    config.NozzleCompensation = {
        ...config.NozzleCompensation,
        SamePlaneMode: samePlaneModeArr.join(','),
        SampleExtentVertical: sampleExtentVerticalArr.join(','),
        SampleExtentHorizontal: sampleExtentHorizontalArr.join(','),
        InterPlaneMode: colorPlaneData?.interPlaneMode
    }

    if (typeof colorPlaneData?.interPlaneMode !== 'undefined') {
        config.NozzleCompensation.InterPlaneMode = colorPlaneData?.interPlaneMode;
    }

    config.TemperatureContraction = {
        ...config.TemperatureContraction,
        TileEdgeContractionXPx: tileEdgeContractionXPx.join(','),
        TileEdgeContractionYPx: tileEdgeContractionYPx.join(','),
        TileCornerContractionXPx: tileCornerContractionXPx.join(','),
        TileCornerContractionYPx: tileCornerContractionYPx.join(',')
    }

    return config;
}

export function voltageAdjustmentParser(voltageAdjustmentData?: PrintHeadInfoItf[], config?: any) {
    if (!voltageAdjustmentData || !config) return config
    voltageAdjustmentData.map(planeHeadInfo => {
        planeHeadInfo.data?.map(item => {
            config[`Head${item.pcc}:${item.pccPosition}`] = {
                ...config[`Head${item.pcc}:${item.pccPosition}`],
                WF_VScale_Coeff: item.voltages?.map(d => parseFloat((d / 100).toFixed(3)) + 1).join(',')
            }
        })
    })
    return config;
}

export function systemSettingParser(systemSettingData?: SystemSettingContext, config?: any) {
    if (!config || !systemSettingData) return config

    const isMixSubsystem = Object.keys(config.System).some(s => /SubSys\d+/.test(s))
    // 编码器
    if (systemSettingData?.encoder) {
        config.Encoder = {
            ...config.Encoder,
            PrintClock: systemSettingData.encoder?.enablePrintClock ? (systemSettingData.encoder?.printClock || config.Encoder.PrintClock || 0) : 0,
            Quadrature: (systemSettingData.encoder?.quadrature === undefined ? config.Encoder.Quadrature : systemSettingData.encoder.quadrature ? '1' : '0')
        }

    }

    // 打印数据位深度
    config.Application.OneBppMapVal = systemSettingData?.printDataBitsDepth?.oneBppMapVal || config.Application.OneBppMapVal
    if (isMixSubsystem) {
        for (const key of Object.keys(config.System)) {
            if (/SubSys\d+/.test(key)) {
                const headType = config.System[key].HeadType
                config[headType][key] = {
                    ...config[headType]?.[key],
                    BitsPerPixel: systemSettingData?.printDataBitsDepth?.bitsPerPixel || config[headType]?.[key]?.BitsPerPixel
                }
            }
        }
    } else {
        const headType = config.System.HeadType
        config[headType] = {
            ...config[headType],
            BitsPerPixel: systemSettingData?.printDataBitsDepth?.bitsPerPixel || config[headType]?.BitsPerPixel
        }
    }


    if (systemSettingData?.simPrint) {
        config.Test = {
            ...config.Test,
            SimFilePath: systemSettingData.simPrint.filePath,
            SaveSimFiles: systemSettingData.simPrint.enableSave ? 1 : 0,
        }
    }

    // PD触发信号
    if (systemSettingData?.productDetect) {
        config.ProductDetect = {
            ...config.ProductDetect,
            Xoffset: mmToPixel(systemSettingData.productDetect?.xOffset || 0, systemSettingData.productDetect?.xdpi || 0) || config.ProductDetect.Xoffset,
            ActiveLow: (systemSettingData.productDetect.activeLow ?? config.ProductDetect.ActiveLow === '1') ? 1 : 0,
            Filter: systemSettingData.productDetect.filter || config.ProductDetect.Filter,
            Lockout: (systemSettingData.productDetect.lockout ?? config.ProductDetect.Lockout) ? 1 : 0,
            MinimumGap: mmToPixel(systemSettingData.productDetect?.minimumGap || 0, systemSettingData.productDetect?.xdpi || 0) || config.ProductDetect?.MinimumGap
        }
    }

    // 自动闪喷
    if (systemSettingData?.autoSpit) {
        config.Application = {
            ...config.Application,
            AutoSpitSeconds: systemSettingData.autoSpit.timeInterval || config.Application?.AutoSpitSeconds,
            IsAutoSpitSecondsActive: (systemSettingData.autoSpit.enableTimeInterval ?? config.Application.IsAutoSpitSecondsActive === '1') ? 1 : 0,
            AutoSpitCount: systemSettingData.autoSpit.spitCount || config.Application?.AutoSpitCount
        }
    }

    // PCC网络
    if (systemSettingData?.networkAdapter) {
        for (const key of Object.keys(config.Ethernet)) {
            if (/Adapter\d+/.test(key)) {
                delete config.Ethernet[key]
            }
        }

        config.Ethernet = {
            ...config.Ethernet,
            ...systemSettingData.networkAdapter.reduce((prev, cur, idx) => {
                return {
                    ...prev,
                    [`Adapter${idx + 1}`]: cur
                }
            }, {})
        }
    }

    // 读取喷头内存
    if (systemSettingData?.readHeadMem) {
        config.Test = {
            ...config.Test,
            HeadInfoLog: (systemSettingData.readHeadMem?.enableSaveToFile ?? config.Test.HeadInfoLog === '1') ? '1' : '0',
            HeadInfoLogPath: systemSettingData.readHeadMem.saveFolder || config.Test.HeadInfoLogPath
        }
    }

    // 设置ERP服务器，接受TCP的指令
    config.Application.TcpCommandServerEnabled = (systemSettingData?.enableTcpCommandServer ?? config.Application.TcpCommandServerEnabled === '1') ? 1 : 0
    // 设置喷头供电
    config.Application.PowerOffDisabledHeads = (systemSettingData?.powerOffDisabledHeads ?? config.Application.PowerOffDisabledHeads === '1') ? 1 : 0
    // 测试图案
    if (systemSettingData?.printTestPatterns) {
        config.Application = {
            ...config.Application,
            ContinuousTestPatterns: (systemSettingData.printTestPatterns?.printAllWithOneProductDetect ?? config.Application.ContinuousTestPatterns === '1') ? 1 : 0,
            MergeTestPatternSubsystems: (systemSettingData.printTestPatterns?.printDoubleSided ?? config.Application.MergeTestPatternSubsystems === '1') ? 1 : 0
        }
    }

    // 数据传输模式
    if (systemSettingData?.dataPathMode) {
        switch (systemSettingData.dataPathMode.mode) {
            case 'fifo':
                config.Application = {
                    ...config.Application,
                    UseFifoDatapath: '1',
                    UseSinglePassScanning: '0',
                    FifoRightAlign: (systemSettingData.dataPathMode.fifoRightAlign ?? config.Application.FifoRightAlign === '1') ? 1 : 0,
                    LookaheadCmdCount: systemSettingData.dataPathMode.lookaheadCmdCount || config.Application.LookaheadCmdCount
                }

                break;
            case 'imageStore':
                config.Application = {
                    ...config.Application,
                    UseFifoDatapath: '0',
                    UseSinglePassScanning: '0'
                }
                break;
            case 'singlePassScan':
                config.Application = {
                    ...config.Application,
                    UseFifoDatapath: '0',
                    UseSinglePassScanning: '1'
                }
        }

        // set scan param in System
        for (const key of Object.keys(config.System)) {
            if (/SubSys\d+/.test(key)) {
                config.System[key] = {
                    ...config.System[key],
                    Scanning: systemSettingData.dataPathMode.mode === 'singlePassScan' ? 1 : 0,
                }

                if (systemSettingData.dataPathMode.mode === 'imageStore') {
                    delete config.System[key].Scanning
                }
            }
            if (key === 'Scanning') {
                config.System[key] = systemSettingData.dataPathMode.mode === 'singlePassScan' ? 1 : 0

                if (systemSettingData.dataPathMode.mode === 'imageStore') {
                    delete config.System.Scanning
                }
            }
        }
    }

    if (systemSettingData?.imageStore) {
        config.SimFlash = {
            ...config.SimFlash,
            DirectDDRAMAccess: (systemSettingData.imageStore.directDDRAMAccess ?? config.SimFlash.DirectDDRAMAccess === '1') ? 1 : 0,
            SimFlashSizeBlocks: (systemSettingData.imageStore.enableVirtualCF ?? parseInt(config.SimFlash.SimFlashSizeBlocks || '0') > 0)
                ? ((systemSettingData.imageStore.simFlashSizeBlocks || 0) * 2 * 1024 * 1024
                    || parseInt(config.SimFlash.SimFlashSizeBlocks || '0'))
                : 0,
        }
        localStorage.setItem(global.SIM_FlASH_SIZE_BLOCKS, config.SimFlash.SimFlashSizeBlocks);

        config.Application = {
            ...config.Application,
            MaxTileXLengthPixels: parseInt(mmToPixel(systemSettingData.imageStore.maxTileXLengthPixels || 0, systemSettingData.imageStore.xdpi || 0).toFixed(0)),
            MaxJobSetCFMemoryPercent: systemSettingData.imageStore.maxJobSetCFMemoryPercent || config.Application.MaxJobSetCFMemoryPercent,
            ClearImageStoreOnYOffsetChange: (systemSettingData.imageStore.clearImageStoreOnYOffsetChange ?? config.Application.ClearImageStoreOnYOffsetChange === '1') ? 1 : 0
        }



    }

    // 设置喷头颜色
    if (systemSettingData.planesPerHDC) {

        const cleanPlaneConfig = (obj: any) => {
            for (const k in obj) {
                if (/Plane\d+/.test(k)) {
                    delete obj[k]
                }
            }
        }

        if (isMixSubsystem) {
            for (const key in config.Planes) {
                if (/SubSys\d+/.test(key)) {
                    config.Planes[key] = {
                        ...config.Planes[key],
                        PlanesPerHDC: systemSettingData.planesPerHDC
                    }

                    cleanPlaneConfig(config.Planes[key])
                }

            }
        } else {
            config.Planes = {
                ...config.Planes,
                PlanesPerHDC: systemSettingData.planesPerHDC
            }

            cleanPlaneConfig(config.Planes)
        }

    }
    return config;
}

export function settingPaneParse(data?: SettingPaneItf, config?: any) {
    if (!config || !data) return config

    const enableBackup = localStorage.getItem(global.ENABLE_BACKUP) === 'true';
    const backupPath = localStorage.getItem(global.BACKUP_PATH_KEY) || '';
    localStorage.setItem(global.ENABLE_BACKUP, data?.enableBackup?.toString() || enableBackup.toString())
    localStorage.setItem(global.BACKUP_PATH_KEY, data?.folderPath || backupPath)


    config.Application = {
        ...config?.Application,
        HotFolder: data?.hotFolder || config?.Application?.HotFolder,
        HotFolderAutoRefresh: (data?.hotFolderAutoRefresh ?? config.Application.HotFolderAutoRefresh === '1') ? '1' : '0',
        ImageX: data?.imageX || config?.Application?.ImageX,
        ImageY: data?.imageY || config?.Application?.ImageY,
        PageDelimiters: data?.pageDelimiters || config.Application?.PageDelimiters,
        CanPrintBmpFiles: data?.canPrintBmpFiles || config.Application?.CanPrintBmpFiles,
        IsBiDirectionalScanning: (data?.biDirectionScan ?? config.Application?.IsBiDirectionalScanning === '1') ? '1' : '0',
        IsFirstScanForwards: (data?.firstScanInJobIsForward ?? config.Application?.IsFirstScanForwards === '1') ? '1' : '0'
    }


    if (data?.planeOffsetTable && data.planeOffsetTable.length > 0) {
        const expectedLen = 32 - (16 - parseInt(config.Application.ConfiguredPlaneCount || '0'))
        const generateImageOffsetArr = (key: 'ImageYOffsets' | 'ImageXOffsets' | 'InterPlaneYOffset', len: number) => {
            const configObj = key === 'InterPlaneYOffset' ? config.NozzleCompensation : config.Application;
            const arrOffset = configObj?.[key].split(',')?.slice(0, len)
            if (arrOffset.length < len) {
                arrOffset.push(...new Array(len - arrOffset.length).fill(0))
            }
            return arrOffset
        }

        const xOffsets = generateImageOffsetArr('ImageXOffsets', expectedLen)
        const yOffset = generateImageOffsetArr('ImageYOffsets', expectedLen)
        const interPlanOffsets = generateImageOffsetArr('InterPlaneYOffset', expectedLen)
        const ydpi = (config.Planes.Yinterlace || config.Planes.SubSys1.Yinterlace) === '1' ? 600 : 1200
        data?.planeOffsetTable?.forEach((item, idx) => {
            xOffsets[idx] = item.x
            yOffset[idx] = item.y
            interPlanOffsets[idx] = Math.floor(mmToPixel(item.y, ydpi))
        })

        config.Application = {
            ...config.Application,
            ImageXOffsets: xOffsets.join(','),
            ImageYOffsets: yOffset.join(','),
        }

        config.NozzleCompensation = {
            ...config.NozzleCompensation,
            InterPlaneYOffset: interPlanOffsets.join(',')
        }
    }

    if (data.reversePassXAdjust) {
        config.Encoder = {
            ...config.Encoder,
            ReverseXadjust: mmToPixel(data.reversePassXAdjust, data.xdpi || 0).toFixed(3)
        }
    }
    return config;
}

export function headInfoParse(data?: HeadSettingCtx, config?: any) {
    if (!data || !config) return config

    if (data?.yInterlace) {
        let isMixSubsystem = false
        for (const key of Object.keys(config.Planes)) {
            if (/SubSys\d+/.test(key)) {
                isMixSubsystem = true
                config.Planes[key] = {
                    ...config.Planes[key],
                    Yinterlace: data.yInterlace
                }
            }
        }

        if (!isMixSubsystem) {
            config.Planes = {
                ...config.Planes,
                Yinterlace: data.yInterlace
            }
        }
    }

    if (data?.planeTable && data.planeTable.length > 0) {

        type ControllerRecordItf = {
            xOffset: number[];
            yOffset: number[];
            orientation: string[];
        }

        let controllerRecord: Record<string, ControllerRecordItf> = {}
        data.planeTable.forEach((headInfo: PrintHeadInfoItf) => {
            controllerRecord = {
                ...controllerRecord,
                ...headInfo.pcc?.reduce<Record<string, ControllerRecordItf>>((prev, cur) => {
                    if (controllerRecord[`Controller${cur}`]) return prev
                    return {
                        ...prev, [`Controller${cur}`]: {
                            xOffset: (config[`Controller${cur}`].Xoffsets?.split(',').map((item: string) => parseFloat(item || '0'))) || new Array(global.MAX_PCC_HEAD_COUNT).fill(0),
                            yOffset: (config[`Controller${cur}`].Yoffsets?.split(',').map((item: string) => parseFloat(item || '0'))) || new Array(global.MAX_PCC_HEAD_COUNT).fill(0),
                            orientation: config[`Controller${cur}`].Orientations?.split(',') || new Array(global.MAX_PCC_HEAD_COUNT).fill('0'),
                        }
                    }
                }, {})
            }

            headInfo.data?.forEach((item: PrintHeadInfoData) => {
                if (!item?.pcc || !item.pccPosition) return
                controllerRecord![`Controller${item.pcc}`].xOffset![item.pccPosition - 1] = mmToPixel(item.xOffset || 0, item.xdpi || 0)
                controllerRecord![`Controller${item.pcc}`].yOffset![item.pccPosition - 1] = item.yOffset || 0
                controllerRecord![`Controller${item.pcc}`].orientation![item.pccPosition - 1] = item.orientation ? '1' : '0'
            })
        })

        // write Xoffsets, Yoffsets, Orientation in Controller
        for (const key in controllerRecord) {
            if (/Controller\d+/.test(key)) {
                config[key] = {
                    ...config[key],
                    Xoffsets: controllerRecord[key].xOffset.join(','),
                    Yoffsets: controllerRecord[key].yOffset.join(','),
                    Orientations: controllerRecord[key].orientation.join(','),
                }
            }
        }

        // write HeadDataDisabled in Application
        config.Application.HeadDataDisable = ''
        data.planeTable.forEach((headInfo: PrintHeadInfoItf) => {
            headInfo.data?.forEach((item: PrintHeadInfoData) => {
                if (!item.enabled) {
                    config.Application.HeadDataDisable = `${config.Application.HeadDataDisable ? config.Application.HeadDataDisable + ',' : ''}${item.pcc}:${item.pccPosition}:1`
                }
            })
        })

    }

    return config;
}