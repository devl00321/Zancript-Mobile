import React from 'react';
import Svg, { Polygon } from 'react-native-svg';
import { TOKENS } from '../../constants/tokens';

const activeTheme = TOKENS.colors.dark;

export function HexLogo({ size = 22 }: { size?: number }) {
  const points = "11,0 20.46,5.5 20.46,16.5 11,22 1.54,16.5 1.54,5.5";
  
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22">
      <Polygon
        points={points}
        fill={activeTheme.accD}
        stroke={activeTheme.accB}
        strokeWidth="1"
      />
    </Svg>
  );
}
