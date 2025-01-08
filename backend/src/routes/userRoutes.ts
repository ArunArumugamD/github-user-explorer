// src/routes/userRoutes.ts
import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();
const userController = new UserController();

// 1. Save GitHub user data
//router.post('/:username', userController.saveUser);

// 2. Get user's mutual followers (friends)
//router.get('/:username/friends', userController.getUserFriends);

// 3. Search users
//router.get('/search', userController.searchUsers);

// 4. Soft delete user
router.delete('/:username', userController.deleteUser);

// 5. Update user fields
router.patch('/:username', userController.updateUser);

// 6. Get sorted users list
router.get('/', userController.getSortedUsers);

router.get('/:username', userController.saveUser);  // Change POST to GET
router.get('/:username/friends', userController.getUserFriends);
router.get('/search', userController.searchUsers);

export default router;