interface Role {
  roleName: string;
  collections?: Collections;
  routes?: Routes;
}

type RouteCollectionPermissions = {
  [permission in PermissionList]: boolean;
};

type Routes = {
  [route in RouteList]: RouteCollectionPermissions;
};
type Collections = {
  [collection in CollectionList]: RouteCollectionPermissions;
};

type CollectionList = 'roles' | 'users';

type PermissionList = 'read' | 'write' | 'delete';

type RouteList = '/admin/users' | '/admin/roles' | '/admin';
