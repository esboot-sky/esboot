import { describe, expect, it } from 'vitest';

import { findPath, findPathById, transformToMenuItems } from './menu';

const menuMock = [
  {
    id: 1,
    name: 'Root',
    path: '/root',
    children: [
      {
        id: 11,
        name: 'Child A',
        path: '/root/a',
        children: [],
      },
      {
        id: 12,
        name: 'Child B',
        path: '/root/b',
        children: [
          {
            id: 121,
            name: 'Leaf',
            path: '/root/b/leaf',
            children: [],
          },
        ],
      },
    ],
  },
];

describe('menu utils', () => {
  it('transformToMenuItems should convert menu nodes recursively', () => {
    const transformed = transformToMenuItems(menuMock);

    expect(transformed).toEqual([
      {
        key: '1',
        label: 'Root',
        path: '/root',
        children: [
          {
            key: '11',
            label: 'Child A',
            path: '/root/a',
          },
          {
            key: '12',
            label: 'Child B',
            path: '/root/b',
            children: [
              {
                key: '121',
                label: 'Leaf',
                path: '/root/b/leaf',
              },
            ],
          },
        ],
      },
    ]);
  });

  it('findPathById should return id chain by path', () => {
    expect(findPathById(menuMock, '/root/b/leaf')).toEqual([1, 12, 121]);
    expect(findPathById(menuMock, '/not-exists')).toBeNull();
  });

  it('findPath should return path by target id', () => {
    expect(findPath(menuMock, 121)).toBe('/root/b/leaf');
    expect(findPath(menuMock, 999)).toBeNull();
  });

  it('utils should handle invalid input safely', () => {
    expect(transformToMenuItems(null)).toEqual([]);
    expect(findPathById(undefined, '/root')).toBeNull();
    expect(findPath(undefined, 1)).toBeNull();
  });
});
