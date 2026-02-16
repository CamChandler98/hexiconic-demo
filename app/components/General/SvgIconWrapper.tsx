import React from "react";
import { View, ViewProps } from "react-native";
import styled from "styled-components/native";

type SvgIconWrapperProps = ViewProps & {
  size?: number;
  paddingPercent?: number;
  children: React.ReactNode;
};

const Wrapper = styled(View)<{ size: number; paddingPercent: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  padding: ${({ paddingPercent }) => paddingPercent}%;
  justify-content: center;
  align-items: center;
`;

export const SvgIconWrapper = ({
  size = 40,
  paddingPercent = 5,
  children,
  style,
  ...rest
}: SvgIconWrapperProps) => {
  return (
    <Wrapper
      size={size}
      paddingPercent={paddingPercent}
      style={style}
      {...rest}
    >
      {children}
    </Wrapper>
  );
};