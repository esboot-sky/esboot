import { describe, expect, it } from 'vitest';

import { filterRoutesByMenu } from './router-utils';

describe('filterRoutesByMenu', () => {
  it('should keep only the routes present in the menu', () => {
    const routes = filterRoutesByMenu(
      [
        { path: 'account-management-center/user-management', element: 'user' },
        { path: 'account-management-center/role-management', element: 'role' },
      ],
      [
        {
          id: 1,
          pid: 0,
          code: 'role-management',
          icon: null,
          name: 'Role Management',
          path: '/account-management-center/role-management',
          routeModule: 'sys',
          title: 'Role Management',
          children: [],
        },
      ],
    );

    expect(routes).toEqual([
      { path: 'account-management-center/role-management', element: 'role' },
    ]);
  });

  it('should return full routes when menu is not provided', () => {
    const routes = [{ path: 'account-management-center/user-management', element: 'user' }];
    expect(filterRoutesByMenu(routes)).toEqual(routes);
  });
});
