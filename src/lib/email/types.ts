/**
 * MEDDY GLOBAL SOLUTIONS LTD — Email Core Types
 */

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
  headers?: Record<string, string>;
}

