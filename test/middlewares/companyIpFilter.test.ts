import { companyIpFilter } from '../../src/middlewares/companyIpFilter';

it('companyIpFilter', () => {
  const x = companyIpFilter({ ips: [] })
  expect(typeof x).toBe('function')
})
