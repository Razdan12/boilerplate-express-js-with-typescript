import Joi from 'joi';
import { existInDatabase, Gender } from '../../base/validator.base.js';

export const CandidateStatus = {
  ENROLL: 'Pendaftaran',
  PASSED_TEST: 'Lulus tes',
  FAILED_TEST: 'Tidak lulus tes',
  WALK_IN: 'Melanjutkan',
  WALK_OUT: 'Mengundurkan diri',
  ACCEPTED: 'Diterima',
  REJECTED: 'Ditolak',
};

export const CandidateStudentType = {
  REGULAR: 'Reguler',
  ABKWC: 'ABK tanpa pendamping',
  ABKWOC: 'ABK dengan pendamping',
};

export const CandidateEduLevel = {
  TK: 'TK',
  SD: 'SD',
  SM: 'SM',
};

export const CandidateEduClass = {
  TKA: 'TK A',
  TKB: 'TK B',
  KELAS1: 'Kelas 1',
  KELAS2: 'Kelas 2',
  KELAS3: 'Kelas 3',
  KELAS4: 'Kelas 4',
  KELAS5: 'Kelas 5',
  KELAS6: 'Kelas 6',
  KELAS7: 'Kelas 7',
  KELAS8: 'Kelas 8',
  KELAS9: 'Kelas 9',
};

export const CandidateValidator = {
  create: Joi.object({
    seasonId: Joi.string().external(existInDatabase('season')).required(),
    fullName: Joi.string().max(50).required(),
    eduLevel: Joi.string()
      .valid(...Object.values(CandidateEduLevel))
      .optional(),
    eduClass: Joi.string().when('eduLevel', {
      switch: [
        {
          is: CandidateEduLevel.TK,
          then: Joi.valid(CandidateEduClass.TKA, CandidateEduClass.TKB),
        },
        {
          is: CandidateEduLevel.SD,
          then: Joi.valid(
            CandidateEduClass.KELAS1,
            CandidateEduClass.KELAS2,
            CandidateEduClass.KELAS3,
            CandidateEduClass.KELAS4,
            CandidateEduClass.KELAS5,
            CandidateEduClass.KELAS6
          ),
        },
        {
          is: CandidateEduLevel.SM,
          then: Joi.valid(
            CandidateEduClass.KELAS7,
            CandidateEduClass.KELAS8,
            CandidateEduClass.KELAS9
          ),
        },
      ],
      otherwise: Joi.forbidden(),
    }),
  }),
  update: Joi.object({
    fullName: Joi.string().max(50).optional(),
    nickName: Joi.string().max(50).optional(),
    birthDate: Joi.date().optional(),
    birthPlace: Joi.string().max(50).optional(),
    gender: Joi.string()
      .valid(...Object.values(Gender))
      .optional(),
  }),
  updateAdmin: Joi.object({
    studentType: Joi.string()
      .valid(...Object.values(CandidateStudentType))
      .optional(),
    eduLevel: Joi.string()
      .valid(...Object.values(CandidateEduLevel))
      .optional(),
    eduClass: Joi.string()
      .valid(...Object.values(CandidateEduClass))
      .optional(),
  }),
  updateBySchedule: Joi.object({
    status: Joi.string()
      .valid(CandidateStatus.PASSED_TEST, CandidateStatus.FAILED_TEST)
      .optional(),
    studentType: Joi.string()
      .valid(...Object.values(CandidateStudentType))
      .optional(),
  }),
  acceptanceUser: Joi.object({
    status: Joi.string()
      .valid(CandidateStatus.WALK_IN, CandidateStatus.WALK_OUT)
      .required(),
  }),
  acceptanceAdmin: Joi.object({
    status: Joi.string()
      .valid(CandidateStatus.ACCEPTED, CandidateStatus.REJECTED)
      .required(),
  }),
};

export default CandidateValidator;
