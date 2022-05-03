import _ from "lodash";
import { Context } from "..";
import {
  addSheet as addSheetInternal,
  deleteSheet as deleteSheetInternal,
} from "../modules";
import { CommonOptions, getSheet } from "./common";
import { INVALID_PARAMS } from "./errors";

export function addSheet(ctx: Context) {
  addSheetInternal(ctx, false);
}

export function deleteSheet(ctx: Context, options: CommonOptions = {}) {
  const sheet = getSheet(ctx, options);
  deleteSheetInternal(ctx, sheet.index!);
}

export function activateSheet(ctx: Context, options: CommonOptions = {}) {
  const sheet = getSheet(ctx, options);
  ctx.currentSheetIndex = sheet.index!;
}

export function setSheetName(
  ctx: Context,
  name: string,
  options: CommonOptions = {}
) {
  const sheet = getSheet(ctx, options);
  sheet.name = name;
}

export function setSheetOrder(ctx: Context, orderList: Record<string, number>) {
  ctx.luckysheetfile?.forEach((sheet) => {
    if (sheet.index! in orderList) {
      sheet.order = orderList[sheet.index!];
    }
  });
  // re-order starting from 0
  _.sortBy(ctx.luckysheetfile, ["order"]).forEach((sheet, i) => {
    sheet.order = i;
  });
}

export function scroll(
  ctx: Context,
  scrollbarX: HTMLDivElement | null,
  scrollbarY: HTMLDivElement | null,
  options: {
    scrollLeft?: number;
    scrollTop?: number;
    targetRow?: number;
    targetColumn?: number;
  }
) {
  if (options.scrollLeft != null) {
    if (!_.isNumber(options.scrollLeft)) {
      throw INVALID_PARAMS;
    }
    if (scrollbarX) {
      scrollbarX.scrollLeft = options.scrollLeft;
    }
  } else if (options.targetColumn != null) {
    if (!_.isNumber(options.targetColumn)) {
      throw INVALID_PARAMS;
    }
    const col_pre =
      options.targetColumn <= 0
        ? 0
        : ctx.visibledatacolumn[options.targetColumn - 1];
    if (scrollbarX) {
      scrollbarX.scrollLeft = col_pre;
    }
  }

  if (options.scrollTop != null) {
    if (!_.isNumber(options.scrollTop)) {
      throw INVALID_PARAMS;
    }
    if (scrollbarY) {
      scrollbarY.scrollTop = options.scrollTop;
    }
  } else if (options.targetRow != null) {
    if (!_.isNumber(options.targetRow)) {
      throw INVALID_PARAMS;
    }
    const row_pre =
      options.targetRow <= 0 ? 0 : ctx.visibledatarow[options.targetRow - 1];

    if (scrollbarY) {
      scrollbarY.scrollTop = row_pre;
    }
  }
}