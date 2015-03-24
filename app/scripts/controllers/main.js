'use strict';

/**
 * @ngdoc function
 * @name pgpFileUploadApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pgpFileUploadApp
 */
angular.module('pgpFileUploadApp')
  .controller('MainCtrl', function ($scope) {
    var pub_key_text = '-----BEGIN PGP PUBLIC KEY BLOCK-----\n\n' +
'mQENBFTjXnkBCADRkpepG4u+3V+EbViJw4JBn8Jv9lj7peCdhIxur+wteU3tooQM\n' +
'gG+KG4uruGcELP611YNlz6d+Jd81/ezQXeOHOp75CUKeL+0GChwH1qZOPEHwQgtt\n' +
'WcCnDWRqtdaIqX2TZdQtjclGCKn4Wfpv6GpNKLLAyX7lbW9fLdwEe3p+vB1dRivl\n' +
'H7YhFFOpFXpusqKocNadF9OmD9PkEmjRmAUJTOcOU8gYDwkVNjuDVhZ6eIKGC0DX\n' +
'v6FJvJSURShFEE1r2Dc8rPeYzZvv9RcLsLhALKHObtNxevz6wAtjOHKXh8pdr/im\n' +
'XDhA1pSXm26UO9efWgHnEFYNnXXlCAEJb2+7ABEBAAG0bFBHUCBGaWxlIFVwbG9h\n' +
'ZGVyIChQbGVhc2UgZG8gbm90IGVuY3J5cHQgYW55IHNlbnNpdGl2ZSBkYXRhIHdp\n' +
'dGggdGhpcyBrZXkuIEl0IGlzIHB1YmxpYyEpIDxudWxsQGV4YW1wbGUuY29tPokB\n' +
'OAQTAQIAIgUCVONeeQIbAwYLCQgHAwIGFQgCCQoLBBYCAwECHgECF4AACgkQ01Ef\n' +
'rgjl+TM4MQf8CQXdZ9ztFtj78Hpttjuzcjz42kIxEYf63hXTK0d/Nx5eq01rSjWK\n' +
'mij0aHIjh+U5NvxcseNaR+VID6jevgVcPo7OS1g/Lyo0YUJLlUSpKQ8Gbh5CBS1+\n' +
'wTgR8GQDX+pEi+CMxWzBFWY/IcqxssKY/V/Tv7UM1hiIGs5ryZPuMMgvYKJobGjZ\n' +
'pFQZvAeGQf92NXaXkx2E08pnBq2eTYcu9OSEDSrB5POE/Tv9IRHpInHqqndOndRD\n' +
'DNtdZZo2ofULQeEVzN085kkqQ/jOCNKDboRqjewMTq98aZFPY9Bf1HKS0r8eBP0b\n' +
'BADNxb+lC/ffsic6eavtBHbPRLYVCfHAOLkBDQRU4155AQgA0dnRoKnEHw/cBvXX\n' +
'AkJk3tZkoGM3QWbGBHd47pmPHGJGD3VOqEFul5jAo5X0agxoP0FZsWbxXEriBefN\n' +
'1GH6ioMly67HdMktkqqJCZr4+qL5yESEhtzL5b8pqex4SGvpkj7VeIN99u+Kq5vj\n' +
'2InUkCr+UYVaXaFCdUIr0WQc68ZgztA0lOqbUPT75Ov+0fmr/hDpZPnr8jN4sEii\n' +
'1UkBBTtwYgONmOw/+UQPrxU6hKnecxgJtHEG3oQ+/kqEipfk0jueaD1/OJhjQmiA\n' +
'CgAz5MaHE0n+qChM+ZvKJO0UImr7yBGEqV+j/MpLc5K01gvQ8EUKX1HX46UkCPg2\n' +
'bK+b3wARAQABiQEfBBgBAgAJBQJU4155AhsMAAoJENNRH64I5fkziMwH/2sOLdH2\n' +
'6TAYjuvgaMHHO5j2EuZpXiePIqcFptk+fUPdc3B7K9CEn+NMorgCChd4W/G/8L6Q\n' +
'UhrUCec2MGNF2Ng3aEFAsS2IS1b4WtDW2K17HDemKBxq4StH8HJDibnxLwvKHcwr\n' +
'fhLKkYknZXKfA+/1jJknNDmFvPfk9LZzHw7BzZ9mcxgKN9sjwgwcyWL/pj4CPhGI\n' +
'uKzbF8gpS2A326yGLQ313jQpuAg6EJ5SSYoVWdlE4MZ8YfCFyFNWFL3PhiGsAd2W\n' +
'79Kw1al8jxwK0+oAIitfQ9aK9IFIPWWPOLq8AyBotdHN9WyT/RT0gCdQZGOWJx68\n' +
'1/57gCaY3rDSMK8=\n' +
'=c4NC\n' +
'----END PGP PUBLIC KEY BLOCK-----\n',
      pub_key = openpgp.key.readArmored(pub_key_text),
      encrypted_streams = {};
 
    
    console.log(pub_key);

    function encryptedFileStream(file, pub_keys) {
      this.file = file;
      this.message_stream = new openpgp.stream.MessageStream(pub_keys, file.size,
                                                         file.name);
      this.message_stream.buffer = new Buffer([], 'binary');
      this.message_stream.on('data', this.on_data);
      this.message_stream.on('end', this.on_end);
    };

    encryptedFileStream.prototype.on_data = function(data) {
      this.buffer = Buffer.concat([this.buffer, data]);
    };

    encryptedFileStream.prototype.on_end = function(data) {
    };

    encryptedFileStream.prototype.read = function(chunk, startByte, endByte, fileType) {
      var neededBytes = (endByte - startByte),
        self = this,
        reader = new FileReader(),
        file = chunk.fileObj.file;

      this.message_stream.on('data', function(data) {
        if (neededBytes >= self.message_stream.buffer.length) {
          var data = new Blob([self.message_stream.buffer.slice(0, neededBytes).toArrayBuffer()]);
          // Investigate if this de-allocates the bytes automatically or not
          self.message_stream.buffer = self.message_stream.buffer.slice(neededBytes);
          chunk.readFinished(data);
        }
      });
      this.message_stream.on('end', function(data) {
          chunk.readFinished(new Blob(nodeBufferToUint8Array(self.message_stream.buffer)));
      });
      
      reader.onloadend = function(e) {
        if (reader.result) {
          self.message_stream.write(reader.result); 
        }
      }
      var function_name = (file.slice ? 'slice' :
        (file.mozSlice ? 'mozSlice' :
          (file.webkitSlice ? 'webkitSlice' :
            'slice')));
      reader.readAsBinaryString(file[function_name](startByte, 
                                                    startByte + neededBytes,
                                                    fileType));
    };

    $scope.flow_init = {
      target: '/upload',
      preprocess: function(chunk) {
        var encrypted_file_stream = new encryptedFileStream(chunk.fileObj, pub_key.keys);
        chunk.fileObj.encrypted_file_stream = encrypted_file_stream;
        //chunk.fileObj.size = encrypted_file_stream.message_stream.size;
        chunk.preprocessFinished();
      },
      read: function(chunk, startByte, endByte, fileType) {
        chunk.fileObj.encrypted_file_stream.read(chunk, startByte, endByte, fileType);
      }
    }  
});
