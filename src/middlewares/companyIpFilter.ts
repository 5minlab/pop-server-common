import { IpFilter as ipfilter } from 'express-ipfilter'

function toIpv6(ip: string) {
  return `::ffff:${ip}`
}

const localhostIps = ['127.0.0.1', '::1']

const ipfilterOpts = {
  mode: 'allow',
  log: false
}

interface Options {
  ips: string[]
}

export function companyIpFilter(opts: Options) {
  const trustableIps = opts.ips
  const ips = [
    ...localhostIps,
    ...localhostIps.map(toIpv6),
    ...trustableIps,
    ...trustableIps.map(toIpv6)
  ]
  return ipfilter(ips, ipfilterOpts)
}
