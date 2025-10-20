import { DialogKey, IdempotencyKeys } from "../constants";

export const getNextIdempotencyKey = (
  currentKey: IdempotencyKeys,
): {
  idempotencyKey: IdempotencyKeys;
  ImSmokingDialogKey: DialogKey;
} => {
  switch (currentKey) {
    case IdempotencyKeys.One:
      return {
        idempotencyKey: IdempotencyKeys.Two,
        ImSmokingDialogKey: DialogKey.im_smoking_2,
      };
    case IdempotencyKeys.Two:
      return {
        idempotencyKey: IdempotencyKeys.Three,
        ImSmokingDialogKey: DialogKey.im_smoking_3,
      };
    case IdempotencyKeys.Three:
    default:
      return {
        idempotencyKey: IdempotencyKeys.One,
        ImSmokingDialogKey: DialogKey.im_smoking_1,
      };
  }
};

export const smokingButtonByIdempotencyKey = (key: IdempotencyKeys): DialogKey => {
  switch (key) {
    case IdempotencyKeys.One:
      return DialogKey.im_smoking_1;
    case IdempotencyKeys.Two:
      return DialogKey.im_smoking_2;
    case IdempotencyKeys.Three:
    default:
      return DialogKey.im_smoking_3;
  }
};