import { ReactNode } from "react";
import { Body, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";

interface ContainerProps {
  preview?: string;
  heading?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

export const EmailContainer = ({ preview, heading, footer, children }: ContainerProps) => (
  <Html>
    <Head />
    {preview ? <Preview>{preview}</Preview> : null}
    <Body style={main}>
      <Container style={container}>
        {heading ? <Heading style={h1}>{heading}</Heading> : null}
        {children}
        {footer ? <Text style={text}>{footer}</Text> : null}
      </Container>
    </Body>
  </Html>
);

export default EmailContainer;

const variables = {
  background: "48 40% 98%",
  primary: "25 95% 53%",
  foreground: "48 10% 10%",
  primaryForeground: "48 10% 10%",
  radius: "0.8rem",
} as const;

const main = {
  backgroundColor: `hsl(${variables.background})`,
  fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
  maxWidth: "100%",
};

const h1 = {
  color: `hsl(${variables.primary})`,
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
};

const text = {
  color: `hsl(${variables.foreground})`,
  fontSize: "16px",
  lineHeight: "26px",
};

const buttonContainer = {
  textAlign: "center" as const,
  marginTop: "32px",
  marginBottom: "32px",
};

const button = {
  backgroundColor: `hsl(${variables.primary})`,
  color: `hsl(${variables.primaryForeground})`,
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
  borderRadius: variables.radius,
};

export const emailStyles = {
  text,
  button,
  buttonContainer,
};
