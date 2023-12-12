import { createBrowserRouter } from 'react-router-dom';

import { filepathToElement } from '@/utils/router';
import RouterConfig from '@/routers/router.config';

const router = createBrowserRouter([...filepathToElement(RouterConfig)]);

export default router;
