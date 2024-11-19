const ROLES = {
  USER: 'user',
  LISTING_OWNER: 'listing_owner',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
};

const ROLE_HIERARCHY = {
  [ROLES.USER]: [],
  [ROLES.LISTING_OWNER]: [ROLES.USER],
  [ROLES.MODERATOR]: [ROLES.LISTING_OWNER, ROLES.USER],
  [ROLES.ADMIN]: [ROLES.MODERATOR, ROLES.LISTING_OWNER, ROLES.USER],
};

const ROLE_PERMISSIONS = {
  [ROLES.USER]: [
    'read:own_profile',
    'update:own_profile',
    'create:listing',
    'update:own_listing',
    'delete:own_listing',
  ],
  [ROLES.LISTING_OWNER]: [
    'read:own_listing',
    'update:own_listing',
    'delete:own_listing',
  ],
  [ROLES.MODERATOR]: ['read:users', 'update:any_listing', 'delete:any_listing'],
  [ROLES.ADMIN]: [
    'create:user',
    'update:any_user',
    'delete:any_user',
    'assign:roles',
  ],
};
