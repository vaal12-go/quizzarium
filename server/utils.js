export const CONSOLE_DEBUG_ENABLE = true;

export function console_debug(title_str, debug_var, debugOverride = false) {
  if (CONSOLE_DEBUG_ENABLE) {
    console.log(title_str + ":>>>", debug_var);
  }
}

export default console_debug;
