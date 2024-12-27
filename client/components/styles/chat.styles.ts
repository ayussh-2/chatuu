import styled from 'styled-components';
import { motion } from 'framer-motion';

export const ChatContainer = styled(motion.div)`
  width: 80px;
  height: 100vh;
  border-right: 1px solid ${props => props.theme.borderColor};
  background: ${props => props.theme.cardBackground};
  backdrop-filter: blur(8px);
`;

export const Header = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.theme.borderColor};
`;

export const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.textColor};
`;

export const SearchContainer = styled.div`
  padding: 1rem;
  position: relative;
`;

export const MessageContainer = styled.div`
  padding: 1rem;
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
`;

export const MessageBubble = styled.div<{ isOwn: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  background: ${props => props.isOwn ? props.theme.primary : props.theme.muted};
  color: ${props => props.isOwn ? props.theme.primaryForeground : props.theme.textColor};
  max-width: 70%;
`;