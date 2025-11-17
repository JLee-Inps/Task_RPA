import React from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
}

const StyledButton = styled.button<{
  $variant: 'primary' | 'secondary' | 'danger' | 'outline';
  $size: 'sm' | 'md' | 'lg';
  $disabled: boolean;
  $loading: boolean;
  $fullWidth: boolean;
}>`
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${props => props.theme.fontWeight.semibold};
  border-radius: ${props => props.theme.borderRadius.lg};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 2px solid transparent;
  
  ${props => props.$fullWidth && css`
    width: 100%;
  `}

  ${props => {
    switch (props.$size) {
      case 'sm':
        return css`
          padding: ${props.theme.spacing.sm} ${props.theme.spacing.md};
          height: 2rem;
          font-size: ${props.theme.fontSize.sm};
        `;
      case 'md':
        return css`
          padding: ${props.theme.spacing.md} ${props.theme.spacing.lg};
          height: 2.5rem;
          font-size: ${props.theme.fontSize.base};
        `;
      case 'lg':
        return css`
          padding: ${props.theme.spacing.lg} ${props.theme.spacing.xl};
          height: 3rem;
          font-size: ${props.theme.fontSize.lg};
        `;
    }
  }}

  ${props => {
    switch (props.$variant) {
      case 'primary':
        return css`
          background-color: ${props.theme.colors.toss.blue};
          color: ${props.theme.colors.white};
          box-shadow: ${props.theme.shadows.button};
          
          &:hover:not(:disabled) {
            background-color: ${props.theme.colors.primary[700]};
            transform: translateY(-1px);
            box-shadow: ${props.theme.shadows.lg};
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${props.theme.shadows.button};
          }
        `;
      case 'secondary':
        return css`
          background-color: ${props.theme.colors.gray[100]};
          color: ${props.theme.colors.gray[800]};
          border-color: ${props.theme.colors.gray[200]};
          
          &:hover:not(:disabled) {
            background-color: ${props.theme.colors.gray[200]};
            border-color: ${props.theme.colors.gray[300]};
          }
        `;
      case 'danger':
        return css`
          background-color: ${props.theme.colors.error[500]};
          color: ${props.theme.colors.white};
          
          &:hover:not(:disabled) {
            background-color: ${props.theme.colors.error[600]};
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          color: ${props.theme.colors.toss.blue};
          border-color: ${props.theme.colors.toss.blue};
          
          &:hover:not(:disabled) {
            background-color: ${props.theme.colors.toss.blue};
            color: ${props.theme.colors.white};
          }
        `;
    }
  }}

  ${props => (props.$disabled || props.$loading) && css`
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  `}

  ${props => props.$loading && css`
    color: transparent;
    
    &::after {
      content: '';
      position: absolute;
      width: 1rem;
      height: 1rem;
      border: 2px solid ${props.$variant === 'outline' ? props.theme.colors.toss.blue : props.theme.colors.white};
      border-top: 2px solid transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `}
`;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  className,
  fullWidth = false,
}) => {
  return (
    <StyledButton
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      $variant={variant}
      $size={size}
      $disabled={disabled}
      $loading={loading}
      $fullWidth={fullWidth}
      className={className}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
