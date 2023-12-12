export interface PrintItemItf {
    id: string;
    imageName: string;
    path?: string // image path
    imageSrc: string;
    num: number;
    finishedTime?: string;
    lastedTime?: string;
    progress?: number;
    buffer?: number;
    checked?: boolean
    status?: 'waiting' | 'printing' | 'finished' | 'failed'
    imageModifiedTime?: string
    pages?: number
    from?: 'waiting' | 'printing' | 'finished'
}


export interface ImageMetaData {
    page?: number // the pages of a pdf file
    files?: string | string[] // file name
    sizeInMillimeters?: number // file size in mm
    sizeInPixels?: number // file size in pixels
    dpi?: string // dots per inch
    bpp: string // bits per pixel
    imageStoreJobs?: string
    modified?: string // modified time
}

export interface PrintHeadInfoItf {
    id: string;
    name: string;
    title: string;
    subTitle?: string;
    planeNum: number;
    planesPerHDC?: number;
    data?: PrintHeadInfoData[];
    color: string;
    pcc?: number[];
    setExtension?: (item: PrintHeadInfoItf, data: PrintPCCInfoData[]) => PrintHeadInfoItf
}

export interface PrintHeadInfoData {
    order?: number;
    id?: string;
    xdpi?: number;
    temperature?: number;
    color?: string;
    pccPosition: number; // order in pcc
    pcc: number;
    channel?: number;
    planeNum?: number;
    planeName?: string;
    yOffset?: number;  // pixel
    xOffset?: number;  // mm
    droppedActiveNozzlesTop?: number;
    droppedActiveNozzlesEnd?: number;
    orientation?: boolean; // false/0: 正装, true/1： 反装
    enabled?: boolean;
    stitchBalance?: number;
    stitchAdjust?: number;
    voltages?: number[]
}

export interface PrintPCCInfoData {
    id?: string;
    name?: string;
    pccNum?: number;
    master?: boolean
    headType?: string;
    pccType?: string;
    encoderMultiplier?: number;
    encoderDivider?: number;
    encoderInvert?: boolean;
    xdpi?: number;
    pdOffset?: number;
    rightToLeft?: boolean;
    headInfo?: PrintHeadInfoData[];
    planesPerHDC?: number;
    disabledMaster?: boolean;
    disabledHeadType?: boolean;
    disabledPccType?: boolean;
    disableXdpi?: boolean;
    disableRightToLeft?: boolean;
    disableAllExceptMaster?: boolean
}


export interface PDCSettingsInContext {
    pccAggregateTable?: PrintPCCInfoData[]
    enableIndependentPrintLane?: boolean
    enableMixSubsystem?: boolean
    PCCMotherboardCount?: number
}

export interface ColorPlaneInContext {
    channelCount?: number
    orificeCompensation?: boolean
    inkVolumePrediction?: boolean
    temperatureContraction?: boolean
    interPlaneMode?: string
    planeInfoArr?: PrintPlaneInfo[]
}

export interface SystemSettingContext {
    encoder?: {
        enablePrintClock?: boolean;
        printClock?: number;
        quadrature?: boolean
    };
    printDataBitsDepth?: {
        bitsPerPixel?: string;
        oneBppMapVal?: string
    };
    simPrint?: {
        enableSave?: boolean;
        filePath?: string;
    };
    productDetect?: PrintProductDetectItf;
    autoSpit?: PrintAutoSpitItf;
    networkAdapter?: string[];
    readHeadMem?: PrintReadHeadMemItf;
    enableTcpCommandServer?: boolean;
    printTestPatterns?: PrintTestPatternsItf;
    dataPathMode?: DataPathModeItf;
    imageStore?: PrintImageStoreItf;
    powerOffDisabledHeads?: boolean;
    planesPerHDC?: string;
}


export interface HeadSettingCtx {
    yInterlace?: string; // 1: 600dpi 2: 1200dpi
    planeTable?: PrintHeadInfoItf[];
}
export interface PdcSettingContextItf {
    settingPane?: SettingPaneItf;
    headSetting?: HeadSettingCtx;
    pdcSettings?: PDCSettingsInContext;
    colorPlane?: ColorPlaneInContext;
    voltageAdjustment?: PrintHeadInfoItf[];
    systemSetting?: SystemSettingContext;
}

export interface NozzleCompensationItf {
    interPlaneYOffset?: number
    samePlaneMode?: string
    sampleExtentVertical?: number
    sampleExtentHorizontal?: number
}

export interface PrintPlaneInfo {
    order?: number
    name?: string
    waveForm?: string
    temperature?: number
    pcc?: string[] // pcc, e.g. 1:2,1:3...
    pccPosition?: number
    system?: number // system order
    nozzleCompensation?: NozzleCompensationItf
    dropSizes?: PlaneDropSizesItf
    temperatureContraction?: PlaneTemperatureContractionItf
}

export interface PlaneDropSizesItf {
    gl1?: number
    gl2?: number
    gl3?: number
}

export interface PlaneTemperatureContractionItf {
    xdpi?: number;
    ydpi?: number;
    tileEdgeContractionXPx?: number
    tileEdgeContractionYPx?: number
    tileCornerContractionXPx?: number
    tileCornerContractionYPx?: number
}

export interface PrintConfigSystemInfo {
    headType?: string;
    pccType?: string;
    rightToLeft?: boolean;
    systemOrder?: number;
}

export interface PrintHeadSystemInfo {
    xdpi?: number
    bitsPerPixel?: string
    headType?: string
    systemOrder?: number
}

export interface PrintProductDetectItf {
    xOffset?: number; // mm -> pixel
    activeLow?: boolean;
    filter?: number;
    lockout?: boolean;
    minimumGap?: number;
    xdpi?: number
}

export interface PrintAutoSpitItf {
    timeInterval?: number;
    enableTimeInterval?: boolean;
    spitCount?: number;
}

export interface PrintReadHeadMemItf {
    enableSaveToFile?: boolean;
    saveFolder?: string;
}

export interface PrintTestPatternsItf {
    printAllWithOneProductDetect?: boolean;
    printDoubleSided?: boolean;
}

export interface DataPathModeItf {
    mode?: 'fifo' | 'singlePassScan' | 'imageStore'
    fifoRightAlign?: boolean;
    lookaheadCmdCount?: number;
}

export interface PrintImageStoreItf {
    directDDRAMAccess?: boolean; // enablePreloadRam
    simFlashSizeBlocks?: number;
    maxTileXLengthPixels?: number;
    maxJobSetCFMemoryPercent?: number;
    clearImageStoreOnYOffsetChange?: boolean;
    enablePCCFlashCard?: boolean;
    enableVirtualCF?: boolean;
    xdpi?: number;
}


export interface PlaneOffsetItf {
    id: number;
    label: string;
    x: number;
    y: number;
    planeNum: number;
}
export interface SettingPaneItf {
    folderPath?: string;
    enableBackup?: boolean;
    hotFolderAutoRefresh?: boolean;
    hotFolder?: string;
    imageX?: number;
    imageY?: number;
    planeOffsetTable?: PlaneOffsetItf[];
    pageDelimiters?: string;
    canPrintBmpFiles?: string
    reversePassXAdjust?: number;
    biDirectionScan?: boolean;
    firstScanInJobIsForward?: boolean;
    xdpi?: number;
    enableImageXExtend?: boolean;
}
export interface TCPConfig {
    port: number,
    downPort: number,
    networkAdapter: string,
    code: string,
    sendJobStatus: boolean
}