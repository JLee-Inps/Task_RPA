import React from 'react';
import styled, { css } from 'styled-components';

interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

const Container = styled.div`
  width: 100%;
`;

const Label = styled.label`
  display: block;
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.gray[700]};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Required = styled.span`
  color: ${props => props.theme.colors.error[500]};
  margin-left: ${props => props.theme.spacing.xs};
`;

const StyledInput = styled.input<{ $hasError: boolean; $disabled: boolean }>`
  width: 100%;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border: 2px solid ${props => props.$hasError ? props.theme.colors.error[300] : props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.xl};
  background-color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSize.base};
  font-family: inherit;
  font-weight: ${props => props.theme.fontWeight.medium};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  height: 3.5rem;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? props.theme.colors.error[500] : props.theme.colors.toss.blue};
    box-shadow: 0 0 0 4px ${props => props.$hasError ? `${props.theme.colors.error[500]}20` : `${props.theme.colors.toss.blue}20`};
    background-color: ${props => props.theme.colors.white};
  }

  &:hover:not(:disabled) {
    border-color: ${props => props.$hasError ? props.theme.colors.error[400] : props.theme.colors.gray[300]};
  }

  ${props => props.$disabled && css`
    background-color: ${props.theme.colors.gray[50]};
    cursor: not-allowed;
    opacity: 0.6;
  `}

  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
    font-weight: ${props => props.theme.fontWeight.normal};
  }
`;

const ErrorMessage = styled.p`
  margin-top: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.error[500]};
  font-weight: ${props => props.theme.fontWeight.medium};
`;

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
}) => {
  const inputId = label ? label.toLowerCase().replace(/\s+/g, '-') : undefined;

  return (
    <Container>
      {label && (
        <Label htmlFor={inputId}>
          {label}
          {required && <Required>*</Required>}
        </Label>
      )}
      <StyledInput
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        $hasError={!!error}
        $disabled={disabled}
      />
      {error && (
        <ErrorMessage>{error}</ErrorMessage>
      )}
    </Container>
  );
};

export default Input;
