import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfig from '../../tailwind.config';

const fullConfig = /* preval */ resolveConfig(tailwindConfig);

export default fullConfig;
