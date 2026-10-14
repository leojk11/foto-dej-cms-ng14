import { definePreset } from '@primeuix/themes';
import Lara from '@primeuix/themes/lara';

// primary palette is built from the project's existing navy / blue colors
export const AppPreset = definePreset(Lara, {
  semantic: {
    primary: {
      50: '#e7f2fe',
      100: '#cfe3fa',
      200: '#a3c9ee',
      300: '#6da6d9',
      400: '#3d82bb',
      500: '#205a89',
      600: '#1c4e78',
      700: '#25476a',
      800: '#143d66',
      900: '#0a2c55',
      950: '#061d3a'
    }
  }
});
