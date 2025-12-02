import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './router/AppRoutes';

export const App = () => {
	const router = createBrowserRouter(routes);
	return <RouterProvider router={router} />;
};
