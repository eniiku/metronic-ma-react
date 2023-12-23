import clsx from "clsx";
import moment from "moment";
import _ from "lodash";

import { toAbsoluteUrl } from "../../../helpers";
import { KTIcon } from "../../../helpers";
import { getTradePrice, getForexTicker } from "../../../../lib/utils";

// type TradeWidgetProps = {
//   className: string
//   data: any
// }

const itemClass = "";
const btnClass =
  "btn btn-icon btn-custom btn-icon-gray-600 btn-active-gray-600 btn-active-color-primary w-35px h-35px";
const btnIconClass = "fs-1 text-white-gray-600 -ms-5";

export function TradeWidget({
  className,
  data,
}: {
  className: string;
  data: any;
}) {
  const username = _.result(data, "user.username", "");
  const profilePicture = _.result(data, "user.profilePicture", "");
  // const equityType = _.result(data, 'equityType', '')
  const equityType = data.equityType;
  const entryPrice = _.result(data, "entryPrice", 0)
    ? equityType === "Crypto"
      ? _.result(data, "entryPrice", 0)?.toFixed(3)
      : _.result(data, "entryPrice", 0)?.toFixed(2)
    : "0";

  const profitOrLossPercentage = data.profitOrLossPercentage
    ? data.profitOrLossPercentage?.toFixed(1)
    : 0;

  const profitOrLossDifference = data.profitOrLossDifference
    ? data.profitOrLossDifference.toFixed(1)
    : 0;

  let tradeDirection = data.tradeDirection;

  const ticker = _.result(data, "ticker", "");
  const sentiment = tradeDirection === "BTO" ? "BULLISH" : "BEARISH";
  const isOpen = _.result(data, "isOpen", false);

  const tickerName = ticker?.split("_")[0];
  const month = ticker?.substring(1, 2);
  const date = ticker?.substring(2, 4);
  const year = ticker?.substring(4, 6);

  if (equityType === "Option") {
    tradeDirection = ticker?.substring(5, 7);
  } else {
    tradeDirection =
      tradeDirection !== "" && tradeDirection === "BTO" ? "C" : "P";
  }

  const strikePrice = ticker?.substring(6);
  const expiryDate = `${month}/${date}/${year}`;
  const expDate = moment(expiryDate, "MM/DD/YYYY").format("MMM DD");

  const given = moment(expiryDate, "MM/DD/YYYY");
  const current = moment().startOf("day");
  const daysOpens = moment.duration(given.diff(current)).asDays();
  const openDays = Math.floor(daysOpens);

  const updatedAt = _.result(data, "updatedAt", "");
  const crDate = moment(updatedAt).format("YYYY, MMM DD");
  const crTime = moment(updatedAt).format("hh:mm A");

  return (
    <div className={`card card-flush ${className} bg-muted`}>
      <div className="p-2 pb-0 d-flex align-items-center justify-content-between w-xl-75">
        <div className="d-flex align-items-center gap-3">
          <div className="text-white-gray-600 fw-bolder fs-2">
            {equityType === "Forex" ? getForexTicker(tickerName) : tickerName}
          </div>
          <img
            alt="Trade Icon"
            src={
              sentiment === "BULLISH"
                ? toAbsoluteUrl("media/custom/bull.png")
                : toAbsoluteUrl("media/custom/bear.png")
            }
            className="h-20px h-lg-30px"
          />
        </div>

        <div className="fw-bold">
          <div className="text-success">BOUGHT</div>
          <div className="text-warning">OPTION</div>
        </div>

        <div className="d-flex align-items-center fw-bold fs-8">
          <div className="bg-white-gray-600 bg-opacity-50 text-white-gray-600 rounded-start-2 p-2 text-center">
            <div className="opacity-50 text-gray-600">Price Loss</div>

            <div className="fs-5">{`$${getTradePrice(
              equityType,
              profitOrLossDifference
            )}`}</div>
          </div>

          <div className="bg-gray-600 bg-opacity-25 text-gray-600 p-2 rounded-end-2 text-center">
            <div className="fs-5 text-danger">{`${profitOrLossPercentage}%`}</div>
            <div className="text-white-gray-600 opacity-50">
              {`% ${profitOrLossPercentage >= 0 ? "Profit" : "Loss"}`}
            </div>
          </div>
        </div>
      </div>

      <div className="separator separator-solid my-3 mx-2 d-xl-none" />

      {/* Data Display */}
      <div className="p-2 w-100">
        {data.tradeData.slice(0, 2).map((option: any) => (
          <div
            key={option._id}
            className="d-flex align-items-center justify-content-between mb-2"
          >
            <div
              className={`rounded-2 w-80px text-center py-1  fw-bold fs-7 ${
                option.transactionType === "Debit" ? "bg-success" : "bg-danger"
              }`}
            >
              {option.transactionType === "Debit" ? "BOUGHT" : "SOLD"}
            </div>

            <div className="d-flex align-items-center fw-semibold fs-8">
              <div className="bg-gray-600 text-white-gray-600 rounded-start-2 p-2">
                {expDate}
              </div>

              <div className="bg-white-gray-600 bg-opacity-25 text-gray-600 p-2 rounded-end-2">
                {`${openDays}D`}
              </div>
            </div>

            <div className="d-flex align-items-center fw-semibold fs-8">
              <div className="bg-gray-600 text-white-gray-600 rounded-start-2 p-2">
                {`$${strikePrice}`}
              </div>
              <div className="bg-white-gray-600 bg-opacity-25 text-gray-600 p-2 rounded-end-2">
                {tradeDirection}
              </div>
            </div>

            <div className="d-flex align-items-center fw-semibold fs-8 gap-2">
              <div>@</div>
              <div className="bg-gray-600 text-white-gray-600 rounded-2 p-2">
                {`$${option.price ? option.price : entryPrice}`}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Conditional ... */}
      {data?.tradeData?.find((x: any) => x?.comment)?.comment ? (
        <div className="fw-bold text-warning p-2 pt-0 text-nowrap">
          Reason:{" "}
          <span className="text-white-gray-600">
            {data?.tradeData?.find((x: any) => x?.comment)?.comment}
          </span>
        </div>
      ) : (
        <div style={{ height: "26px" }}></div>
      )}

      <div className="d-flex align-items-center justify-content-between bg-danger bg-opacity-25 p-2 ms-0 gap-2 rounded-bottom-2 w-100 h-100">
        {/* Avatar */}
        <div className="symbol-group symbol-hover flex-nowrap  ms-0 gap-2">
          <div
            className="symbol symbol-35px symbol-circle ms-0"
            data-bs-toggle="tooltip"
            // title={item.name}
          >
            <img
              alt="Pic"
              src={
                profilePicture
                  ? profilePicture
                  : toAbsoluteUrl("media/avatars/300-2.jpg")
              }
            />
          </div>

          <div className="fw-bold text-white-gray-600 fs-7">{username}</div>

          <div className={clsx("app-navbar-item", itemClass)}>
            <div className={btnClass}>
              <KTIcon iconName="arrow-right" className={btnIconClass} />
            </div>
          </div>
        </div>

        {/* Status:: Closed or Open */}
        <div className={clsx("d-flex align-items-center", itemClass)}>
          <div className={btnClass}>
            <KTIcon
              iconName="lock"
              className={`${isOpen ? "text-success" : "text-danger"} fs-4`}
            />
          </div>
          <div className="fw-bold text-white-gray-600 fs-7 text-white-gray-600">
            {isOpen ? "Open" : "Closed"}
          </div>
        </div>

        {/* Time & Date */}
        <div className="text-center">
          <div className="fw-bold text-gray-600">{crDate}</div>
          <div className="fw-bold text-white-gray-600">{crTime}</div>
        </div>
      </div>
    </div>
  );
}
