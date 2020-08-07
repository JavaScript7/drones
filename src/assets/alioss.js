let OSS = require('ali-oss')
let client = new OSS({
  region: '<oss region>',
	//云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，创建并使用STS方式来进行API访问
  accessKeyId: '<Your accessKeyId(STS)>',
  accessKeySecret: '<Your accessKeySecret(STS)>',
  stsToken: '<Your securityToken(STS)>',
  bucket: '<Your bucket name>'
})