import _ from "lodash";

export const pickUser = (user) => {
  return _.pick(user, [
    "_id",
    "name",
    "email",
    "phone",
    "role",
    "addresses",
    "avatar",
    "createdAt",
    "updatedAt",
  ]);
};
