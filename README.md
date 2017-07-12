# grunt-alibabacloud-oss
> File uploader for Alibaba Cloud (Aliyun) OSS.  Grunt wrapper for [ali-oss](https://www.npmjs.com/package/ali-oss).


## Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-alibabacloud-oss --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-alibabacloud-oss');
```

## Upload task
_Run this task with the `grunt alibabacloud_oss` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Options

- accessKeyId {String} access key you create on aliyun console website
- accessKeySecret {String} access secret you create
- [bucket] {String} the default bucket you want to access
  If you don't have any bucket, please use `putBucket()` create one first.
- [endpoint] {String} oss region domain. It takes priority over `region`.
- [region] {String} the bucket data region location, please see [Data Regions](https://help.aliyun.com/document_detail/31837.html),
  default is `oss-cn-hangzhou`.
- [internal] {Boolean} access OSS with aliyun internal network or not, default is `false`.
  If your servers are running on aliyun too, you can set `true` to save lot of money.
- [secure] {Boolean} instruct OSS client to use HTTPS (secure: true) or HTTP (secure: false) protocol.
- [timeout] {String|Number} instance level timeout for all operations, default is `60s`

### Usage Examples

```js
{ "alibabacloud_oss": {
	"options": {
		"region": 'oss-cn-shanghai',
		"accessKeyId": "XXXXXXXXXXXXX",
		"accessKeySecret": "XXXXXXXXXXX"
	},
	"main": {
		"files": [
			{
				"expand": true,
				"cwd": "deploy",
				"src": ["**/*"],
				"dest": "/"
			}
		]
	}
}
```