/**
 * MEDDY GLOBAL SOLUTIONS LTD — T4: Owner Custom Message Template
 *
 * Wrapper module mapping owner compose requests into the standard template registry.
 */

export {
  renderOwnerMessage,
  formatOwnerBody,
  parseMessageFile,
} from "../compose.ts";
export type {
  OwnerMessageHeader,
  OwnerMessageInput,
} from "../compose.ts";

