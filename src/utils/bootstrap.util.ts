import { ADMIN_ROLE, KYC_STATUS } from '../constants/user.constants';
import { findOne, upsert } from '../helpers/db.helpers';
import adminModel from '../models/admin.model';
import { genHash } from './common.util';


export const bootstrapAdmin = async function (cb: Function) {

  const userPassword = await genHash("admin@123");

  const adminData = {
    password: userPassword,
    email: 'admin@admin.com',
    full_name: 'Admin',
    role: ADMIN_ROLE,
  };

  const adminDoc = await findOne(adminModel, { email: adminData.email });
  if (!adminDoc) {
    await upsert(adminModel, adminData)
  }

  cb();
};