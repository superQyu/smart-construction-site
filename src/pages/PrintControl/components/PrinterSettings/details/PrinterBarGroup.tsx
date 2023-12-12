import { useState, useEffect } from 'react';
import type { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { useSnackbar } from '@/context/SnackbarContext';

import SubCard from '@/components/ContentCard/SubCard';
import DynamicList, { ItemComponent } from '@/components/CustomComponents/DynamicList';
import CusButton from '@/components/CustomComponents/CusButton';

export interface Props extends HTMLProps<HTMLElement> {
  params: {
    name: string;
  };
}

type inkBoxVolumeType = {
  inkDropletSize: string;
  skinLift: string;
};
type StateType = {
  resolutionRatio: string[];
  PixelAvailableBits: string[];
  dropletSize: string[];
  inkBoxVolume: inkBoxVolumeType[];
};
const defSX = {
  subTitle: { fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap', color: '#fff' },
  subCard: {
    marginBottom: '8px',
    '.content': { padding: '0' },
    '.content-input': { padding: '0 19px', 'div.MuiBox-root': { padding: 0 } },
  },
};
const ItemInputComponent: React.FC<ItemComponent> = ({ value, index, onChange, onBlur, editable = false }) => {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={(e) => onBlur(e as React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, index)}
      disabled={editable}
      sx={{
        width: '100%',
        '& input': { padding: '7px 14px', backgroundColor: '#ebf0fe', fontWeight: 700, textAlign: 'center' },
        fieldset: { border: 'none' },
        '& label': { top: '-8px' },
      }}
    />
  );
};
const ItemSelectComponent: React.FC<{ value: string; onChange: (value: string) => void; editable?: boolean }> = ({
  value,
  onChange,
  editable = false,
}) => {
  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={editable}
      sx={{
        width: '100%',
        fieldset: { border: 'none' },
        '& .MuiSelect-select': {
          padding: '7px 14px',
          backgroundColor: '#ebf0fe',
          fontWeight: 700,
          textAlign: 'center',
        },
      }}
    >
      {[
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ].map(({ label, value }, index) => (
        <MenuItem key={index} value={value}>
          {label}
        </MenuItem>
      ))}
    </Select>
  );
};
export default function PrinterBarGroupDetail({}: Props) {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(false);

  const [state, setState] = useState<StateType>({
    resolutionRatio: ['100*100 dpi'], // 分辨率
    PixelAvailableBits: ['1'], // 每像素可用位数
    dropletSize: ['1'], // 滴液大小
    inkBoxVolume: [],
  });

  const handleResolutionChange = ({
    key,
    newItems,
  }: {
    key: string;
    value: string;
    index: number;
    newItems: string[];
  }) => {
    setState({ ...state, [key]: [...newItems] });
  };

  const handleInputValue = (key: keyof StateType, value: string, index: number) => {
    setState((prevState) => {
      const newItems = [...prevState[key]];
      newItems[index] = value;
      return { ...prevState, [key]: newItems };
    });
  };

  const removeItem = ({ key, newItems }: { key: string; index: number; newItems: string[] }) => {
    setState({ ...state, [key]: [...newItems] });
  };

  const handleSkinLiftValue = (key: keyof StateType, subKey: keyof inkBoxVolumeType, value: string, index: number) => {
    const newItems = [...state[key]];
    (newItems[index] as inkBoxVolumeType)[subKey] = value;
    setState({ ...state, [key]: newItems });
  };
  const applyItem = () => {
    showSnackbar({
      message: `${t('genericName.operation', '操作')}${t('genericName.success', '成功')}`,
      severity: 'success',
    });
  };
  const cancelItem = () => {
    showSnackbar({
      message: `${t('genericName.operation', '操作')}${t('genericName.cancel', '取消')}`,
      severity: 'warning',
    });
  };

  useEffect(() => {
    const inkDropletSizes = state.dropletSize;

    const updatedInkBoxVolume = inkDropletSizes.map((inkDropletSize, index) => {
      return {
        inkDropletSize,
        skinLift: state.inkBoxVolume[index]?.skinLift || '0.0',
      };
    });
    setState({
      ...state,
      inkBoxVolume: updatedInkBoxVolume,
    });
  }, [state.dropletSize]);

  return (
    <Box className="h-full" sx={{ width: '870px' }}>
      <Box>
        <Grid
          item
          className="flex"
          sx={{
            '.MuiGrid-root': { paddingBottom: '3px' },
            '& > :not(style)': { paddingLeft: '8px', paddingRight: '8px' },
          }}
          container
        >
          <Grid item xs={12} sm={6} md={4} className="sm:max-h100% max-h100% h-full">
            <SubCard
              contentClassName="content overflow-y-auto"
              sx={{ ...defSX.subCard }}
              Head={() => (
                <Typography sx={{ ...defSX.subTitle }}>
                  {`${t('genericName.resolutionRatio', '分辨率')}${t('genericName.tabulation', '列表')}`}
                </Typography>
              )}
            >
              <Box sx={{ mt: '4px' }}>
                <DynamicList
                  items={state.resolutionRatio}
                  onInputBlur={(value, index) => handleInputValue('resolutionRatio', value, index)}
                  handleRemoveItem={(index, newItems) => removeItem({ key: 'resolutionRatio', index, newItems })}
                  ItemComponent={ItemInputComponent}
                />
              </Box>
            </SubCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4} className="sm:max-h100% max-h100% h-full">
            <SubCard
              contentClassName="content overflow-y-auto"
              sx={{ ...defSX.subCard }}
              Head={() => (
                <Typography sx={{ ...defSX.subTitle }}>
                  {t('genericName.PixelAvailableBits', '每像素可用位数')}
                </Typography>
              )}
            >
              <Box sx={{ mt: '4px' }}>
                <DynamicList
                  items={state.PixelAvailableBits}
                  onItemsChange={(value, index, newItems) =>
                    handleResolutionChange({
                      key: 'PixelAvailableBits',
                      value,
                      index,
                      newItems,
                    })
                  }
                  handleRemoveItem={(index, newItems) => removeItem({ key: 'PixelAvailableBits', index, newItems })}
                  ItemComponent={ItemSelectComponent}
                />
              </Box>
            </SubCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4} className="sm:max-h100% max-h100% h-full ">
            <SubCard
              contentClassName="content overflow-y-auto"
              sx={{ ...defSX.subCard }}
              Head={() => (
                <Typography sx={{ ...defSX.subTitle }}>
                  {`${t('genericName.dropletSize', '滴液大小')}${t('genericName.tabulation', '列表')}`}
                </Typography>
              )}
            >
              <Box sx={{ mt: '4px' }}>
                <DynamicList
                  items={state.dropletSize}
                  onInputBlur={(value, index) => handleInputValue('dropletSize', value, index)}
                  handleRemoveItem={(index, newItems) => removeItem({ key: 'dropletSize', index, newItems })}
                  ItemComponent={ItemInputComponent}
                />
              </Box>
            </SubCard>
          </Grid>
        </Grid>
        <Grid
          item
          className="flex"
          sx={{
            '.MuiGrid-root': { paddingBottom: '3px' },
            '& > :not(style)': { paddingLeft: '8px', paddingRight: '8px' },
          }}
          container
        >
          <Grid item xs={12} sm={6} md={4} className="sm:max-h100% max-h100% h-full"></Grid>
          <Grid item xs={12} sm={6} md={4} className="sm:max-h100% max-h100% h-full"></Grid>
          <Grid item xs={12} sm={6} md={4} className="sm:max-h100% max-h100% h-full">
            <Accordion
              expanded={expanded}
              sx={{
                m: '0!important',
                border: 'none',
                boxShadow: 'none',
                '& .MuiPaper-rounded': { mb: 0 },
                '& .MuiButtonBase-root': {
                  minHeight: 'initial',
                  padding: '0',
                  '& .MuiAccordionSummary-content': {
                    m: '0',
                    width: '100%',
                    '&>.MuiBox-root': { width: '100%', padding: '0' },
                  },
                },
                '&::before': { height: '0' },
                '.Mui-expanded': { m: '0!important', minHeight: 'inherit!important' },
              }}
            >
              <AccordionSummary
                sx={{
                  '$ .MuiAccordionSummary-content': {
                    display: 'none',
                  },
                  '.items-center': {
                    backgroundColor: '#4671f5',
                    height: '28px',
                  },
                }}
              >
                <Box sx={{ padding: '0 30px' }}>
                  <SubCard
                    contentClassName="content-input overflow-y-auto"
                    sx={{ ...defSX.subCard }}
                    Head={() => (
                      <Typography
                        onClick={() => setExpanded(!expanded)}
                        sx={{ ...defSX.subTitle, cursor: 'pointer', width: '100%' }}
                      >
                        {t('printControl.smartMediumDetail.inkBoxVolume', '配置墨盒体积')}
                      </Typography>
                    )}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: '0', border: '1px solid rgba(0, 0, 0, 0.12)', borderTop: 'none' }}>
                <Grid
                  item
                  className="flex overflow-y-auto"
                  sx={{
                    '& .content-inner': { overflow: 'inherit' },
                    '.MuiGrid-root': { paddingBottom: '3px' },
                    '& > :not(style)': { paddingLeft: '0px', paddingRight: '0px' },
                  }}
                  container
                >
                  <Grid item xs={12} sm={6} md={6} className="sm:max-h100% max-h100% h-full">
                    <Typography sx={{ ...defSX.subTitle, backgroundColor: '#648aff', mr: '5px' }}>
                      {t('printControl.smartMediumDetail.inkDropletSize', '墨滴大小')}
                    </Typography>
                    <DynamicList
                      items={state.inkBoxVolume.map(({ inkDropletSize }) => inkDropletSize)}
                      onInputBlur={(value, index) => handleInputValue('dropletSize', value, index)}
                      ItemComponent={ItemInputComponent}
                      showFooter={false}
                      editable={true}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} className="sm:max-h100% max-h100% h-full">
                    <Typography sx={{ ...defSX.subTitle, backgroundColor: '#648aff', ml: '5px' }}>
                      {t('printControl.smartMediumDetail.skinLift', '皮升')}
                    </Typography>

                    <DynamicList
                      items={state.inkBoxVolume.map(({ skinLift }) => skinLift)}
                      onInputBlur={(value, index) => handleSkinLiftValue('inkBoxVolume', 'skinLift', value, index)}
                      ItemComponent={ItemInputComponent}
                      showFooter={false}
                    />
                  </Grid>
                </Grid>
                <Box className="flex " sx={{ padding: '5px 10px', justifyContent: 'space-between!important' }}>
                  <CusButton disabled={state.dropletSize.length === 0} onClick={applyItem}>
                    {t('genericName.apply', '应用')}
                  </CusButton>
                  <CusButton
                    disabled={state.dropletSize.length === 0}
                    sx={{ backgroundColor: '#dfe0e3', color: '#4b4b4d' }}
                    onClick={cancelItem}
                  >
                    {t('genericName.cancel', '取消')}
                  </CusButton>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
