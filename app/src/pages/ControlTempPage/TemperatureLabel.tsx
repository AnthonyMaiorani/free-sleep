import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { formatTemperature } from '@lib/temperatureConversions.ts';


type TemperatureLabelProps = {
  isOn: boolean;
  sliderTemp: number;
  sliderColor: string;
  currentTargetTemp: number;
  currentTemperatureF: number;
  displayCelsius: boolean;
}


export default function TemperatureLabel({
  isOn,
  sliderTemp,
  sliderColor,
  currentTargetTemp,
  currentTemperatureF,
  displayCelsius
}: TemperatureLabelProps) {
  const theme = useTheme();

  let topTitle: string;
  // Handle user actively changing temp
  if (sliderTemp !== currentTargetTemp) {
    if (sliderTemp < currentTemperatureF) {
      topTitle = 'Cool to';
    } else if (sliderTemp > currentTemperatureF) {
      topTitle = 'Warm to';
    } else {
      topTitle = '';
    }
  } else {
    if (currentTemperatureF < currentTargetTemp) {
      topTitle = 'Warming to';
    } else if (currentTemperatureF > currentTargetTemp) {
      topTitle = 'Cooling to';
    } else {
      topTitle = '';
    }
  }

  return (
    <div
      style={ {
        position: 'absolute',
        top: '10%',
        left: '50%',
        pointerEvents: 'none',
        textAlign: 'center',
        height: '300px',
        width: '100%',
      } }
    >
      {
        isOn ? (
          <Box
            sx={ {
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              width: '100%',
            } }
          >
            <Typography
              sx={ {
                textWrap: 'nowrap',
                textAlign: 'center',
                minHeight: '1.5rem',
                visibility: topTitle ? 'visible' : 'hidden',
              } }
              color={ theme.palette.grey[400] }
            >
              { topTitle || ' ' }
            </Typography>

            { /* Temperature */ }
            <Typography
              sx={ { textWrap: 'nowrap', mb: .5 } }
              variant="h2"
              color={ sliderColor }
            >
              { formatTemperature(currentTargetTemp !== sliderTemp ? sliderTemp : currentTargetTemp, displayCelsius) }
            </Typography>
            { /* Currently at label */ }
            <Typography
              sx={ { textWrap: 'nowrap', mb: 1 } }
              color={ theme.palette.grey[400] }
            >
              { `Currently at ${formatTemperature(currentTemperatureF, displayCelsius)}` }
            </Typography>
          </Box>
        ) : (
          <Box
            sx={ {
              position: 'absolute',
              top: '10%',
              left: '50%',
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              width: '100%',
            } }
          >
            <Typography
              variant="h3"
              color={ theme.palette.grey[800] }
            >
              Off
            </Typography>
          </Box>
        )
      }
    </div>
  );
}
