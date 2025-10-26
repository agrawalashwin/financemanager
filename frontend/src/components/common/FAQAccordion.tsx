import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  Box,
} from '@mui/material';
import { ExpandMoreRounded as ExpandMoreIcon } from '@mui/icons-material';
import { tokens } from '../../theme/tokens';

interface FAQItemProps {
  question: string;
  answer: string;
  defaultExpanded?: boolean;
}

interface FAQAccordionProps {
  items: FAQItemProps[];
  title?: string;
}

/**
 * FAQ Item Component - Nestly Style
 * Single accordion item with question and answer
 */
export function FAQItem({ question, answer, defaultExpanded = false }: FAQItemProps) {
  return (
    <Accordion
      disableGutters
      defaultExpanded={defaultExpanded}
      sx={{
        border: `1px solid ${tokens.grey[100]}`,
        borderRadius: tokens.radius.md,
        mb: 1.5,
        '&:before': {
          display: 'none',
        },
        '&.Mui-expanded': {
          margin: 0,
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          py: 2,
          px: 2.5,
          '&:hover': {
            backgroundColor: tokens.grey[50],
          },
          '&.Mui-expanded': {
            backgroundColor: tokens.grey[50],
            borderBottom: `1px solid ${tokens.grey[100]}`,
          },
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: tokens.grey[900],
          }}
        >
          {question}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          py: 2.5,
          px: 2.5,
          backgroundColor: '#FFFFFF',
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            lineHeight: 1.7,
          }}
        >
          {answer}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}

/**
 * FAQ Accordion Component - Nestly Style
 * Collection of FAQ items with optional title
 */
export function FAQAccordion({ items, title }: FAQAccordionProps) {
  return (
    <Box>
      {title && (
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: 700,
            color: tokens.grey[900],
          }}
        >
          {title}
        </Typography>
      )}
      <Stack spacing={0}>
        {items.map((item, index) => (
          <FAQItem
            key={index}
            question={item.question}
            answer={item.answer}
            defaultExpanded={item.defaultExpanded}
          />
        ))}
      </Stack>
    </Box>
  );
}

export default FAQAccordion;

