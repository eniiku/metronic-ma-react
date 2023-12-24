export function DropdownCustom() {
  return (
    <div
      className='menu menu-sub menu-sub-dropdown w-300px w-md-350px w-lg-400px'
      data-kt-menu='true'
    >
      <div className='px-7 py-5'>
        <div className='fs-5 text-gray-900 fw-bolder'>Trade Filter</div>
      </div>

      <div className='separator border-gray-200'></div>

      <div className='px-7 py-5'>
        {/* Ticker */}
        <div className='mb-10'>
          <input
            type='text'
            className='form-control form-control-sm form-control-solid border-gray-500'
            name='ticker'
            placeholder='Ticker'
            // value={data.appBasic.appName}
            // onChange={(e) =>
            //   updateData({
            //     appBasic: {
            //       appName: e.target.value,
            //       appType: data.appBasic.appType,
            //     },
            //   })
            // }
          />
          {/* {!data.appBasic.appName && hasError && (
            <div className='fv-plugins-message-container'>
              <div data-field='appname' data-validator='notEmpty' className='fv-help-block'>
                App name is required
              </div>
            </div>
          )} */}
        </div>

        {/* Equity Type  */}
        <div className='mb-10'>
          <label className='form-label fw-bold'>Equity Type</label>

          <div className='d-flex flex-wrap align-items-center gap-4'>
            {['All', 'Stock', 'Option', 'Forex', 'Crypto'].map(
              (item, index) => (
                <label
                  key={item}
                  className='form-check form-check-sm form-check-custom form-check-solid me-5'
                >
                  <input
                    className='form-check-input'
                    type='checkbox'
                    value={index + 1}
                  />
                  <span className='form-check-label'>{item}</span>
                </label>
              )
            )}
          </div>
        </div>

        {/* Transaction Type & Position */}
        <div className='mb-10 d-flex gap-5'>
          <div>
            <label className='form-label fw-bold'>Transaction Type</label>

            <div className='d-flex flex-wrap gap-4'>
              {['Credit', 'Debit'].map((item, index) => (
                <label
                  key={item}
                  className='form-check form-check-sm form-check-custom form-check-solid me-5'
                >
                  <input
                    className='form-check-input'
                    type='checkbox'
                    value={index + 1}
                  />
                  <span className='form-check-label'>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className='form-label fw-bold'>Option</label>

            <div className='d-flex flex-wrap gap-4'>
              {['Open', 'Closed'].map((item, index) => (
                <label
                  key={item}
                  className='form-check form-check-sm form-check-custom form-check-solid me-5'
                >
                  <input
                    className='form-check-input'
                    type='checkbox'
                    value={index + 1}
                  />
                  <span className='form-check-label'>{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order By  */}
        <div className='mb-10'>
          <label className='form-label fw-bold'>Order By</label>

          <div className='d-flex flex-wrap align-items-center gap-4'>
            {[
              'Profit Or Loss%',
              'Closed Date',
              'Crafted Date',
              'Last Updated',
            ].map((item, index) => (
              <label
                key={item}
                className='form-check form-check-sm form-check-custom form-check-solid me-5'
              >
                <input
                  className='form-check-input'
                  type='checkbox'
                  value={index + 1}
                />
                <span className='form-check-label'>{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort Order Type  */}
        <div className='mb-10'>
          <label className='form-label fw-bold'>Sort Order</label>

          <div className='d-flex flex-wrap align-items-center gap-4'>
            {['Ascending Order', 'Descending Order'].map((item, index) => (
              <label
                key={item}
                className='form-check form-check-sm form-check-custom form-check-solid me-5'
              >
                <input
                  className='form-check-input'
                  type='checkbox'
                  value={index + 1}
                />
                <span className='form-check-label'>{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Risk Type  */}
        <div className='mb-10'>
          <label className='form-label fw-bold'>Risk Type</label>

          <div className='d-flex flex-wrap align-items-center gap-4'>
            {['Standard', 'Risky', 'Swing', 'Day Trade'].map((item, index) => (
              <label
                key={item}
                className='form-check form-check-sm form-check-custom form-check-solid me-5'
              >
                <input
                  className='form-check-input'
                  type='checkbox'
                  value={index + 1}
                />
                <span className='form-check-label'>{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* User Filter */}
        <div className='mb-10'>
          <label className='d-flex align-items-center form-label fw-bold mb-2'>
            <span>User Filter</span>
            <i
              className='fas fa-exclamation-circle ms-2 fs-7'
              data-bs-toggle='tooltip'
              title='Specify the user name you want to filter'
            ></i>
          </label>
          <input
            type='text'
            className='form-control form-control-sm form-control-solid border-gray-500'
            name='ticker'
            placeholder='Ex:DesiArtist'
            // value={data.appBasic.appName}
            // onChange={(e) =>
            //   updateData({
            //     appBasic: {
            //       appName: e.target.value,
            //       appType: data.appBasic.appType,
            //     },
            //   })
            // }
          />
          {/* {!data.appBasic.appName && hasError && (
            <div className='fv-plugins-message-container'>
              <div data-field='appname' data-validator='notEmpty' className='fv-help-block'>
                App name is required
              </div>
            </div>
          )} */}
        </div>

        {/* Action Buttons */}

        <div className='d-flex justify-content-end'>
          <button
            type='reset'
            className='btn btn-sm btn-light btn-active-light-primary me-2'
            data-kt-menu-dismiss='true'
          >
            Reset
          </button>

          <button
            type='submit'
            className='btn btn-sm btn-primary'
            data-kt-menu-dismiss='true'
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
