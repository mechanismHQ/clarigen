export interface Logger {
  error(input: string | Error): void;
  log(message?: string): void;
}

export const ConsoleLogger: Logger = {
  error: (input: string | Error): void => {
    console.error(input);
  },
  log: (message?: string): void => {
    console.log(message);
  },
};
