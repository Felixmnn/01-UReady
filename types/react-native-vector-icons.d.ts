declare module 'react-native-vector-icons/FontAwesome5' {
  import { Component } from 'react';
  import { IconProps } from 'react-native-vector-icons/Icon';

  export default class Icon extends Component<IconProps> {}
}

declare module 'react-katex' {
  import * as React from 'react';

  export interface BlockMathProps {
    math: string;
    errorColor?: string;
    renderError?: (error: Error) => React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }

  export class BlockMath extends React.Component<BlockMathProps> {}
}

// declarations.d.ts
declare module "@/components/(shop)/add" {
  import { ComponentType } from "react";
  const RewardedAdScreen: ComponentType<any>;
  export default RewardedAdScreen;
}

