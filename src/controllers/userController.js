import { StatusCodes } from 'http-status-codes';
import * as userService from '../services/userService.js';

export async function join(req, res) {
  const { email, password } = req.body;
  // TODO: email로 유저 찾아서 중복 확인

  const userId = await userService.join(email, password);
  // TODO: userId 토큰으로 변경
  return res.status(StatusCodes.CREATED).json({ userId });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const token = await userService.login(email, password);

  if (!token)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });

  res.cookie('token', token, {
    httpOnly: true,
  });

  return res.sendStatus(StatusCodes.OK);
}

export async function passwordResetRequest(req, res) {
  const { email } = req.body;
  const user = await userService.getByEmail(email);

  if (!user)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: '존재하지 않는 이메일입니다.' });

  return res.status(StatusCodes.OK).json({ email });
}

export async function resetPassword(req, res) {
  const { email, password } = req.body;
  const result = await userService.updatePassword(email, password);

  if (!result.affectedRows)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: '존재하지 않는 이메일입니다.' });

  return res.sendStatus(StatusCodes.OK);
}
