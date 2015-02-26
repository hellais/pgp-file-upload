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

    var pub_key_text = '-----BEGIN PGP PUBLIC KEY BLOCK-----' +
'mQENBFTjXnkBCADRkpepG4u+3V+EbViJw4JBn8Jv9lj7peCdhIxur+wteU3tooQM' +
'gG+KG4uruGcELP611YNlz6d+Jd81/ezQXeOHOp75CUKeL+0GChwH1qZOPEHwQgtt' +
'WcCnDWRqtdaIqX2TZdQtjclGCKn4Wfpv6GpNKLLAyX7lbW9fLdwEe3p+vB1dRivl' +
'H7YhFFOpFXpusqKocNadF9OmD9PkEmjRmAUJTOcOU8gYDwkVNjuDVhZ6eIKGC0DX' +
'v6FJvJSURShFEE1r2Dc8rPeYzZvv9RcLsLhALKHObtNxevz6wAtjOHKXh8pdr/im' +
'XDhA1pSXm26UO9efWgHnEFYNnXXlCAEJb2+7ABEBAAG0bFBHUCBGaWxlIFVwbG9h' +
'ZGVyIChQbGVhc2UgZG8gbm90IGVuY3J5cHQgYW55IHNlbnNpdGl2ZSBkYXRhIHdp' +
'dGggdGhpcyBrZXkuIEl0IGlzIHB1YmxpYyEpIDxudWxsQGV4YW1wbGUuY29tPokB' +
'OAQTAQIAIgUCVONeeQIbAwYLCQgHAwIGFQgCCQoLBBYCAwECHgECF4AACgkQ01Ef' +
'rgjl+TM4MQf8CQXdZ9ztFtj78Hpttjuzcjz42kIxEYf63hXTK0d/Nx5eq01rSjWK' +
'mij0aHIjh+U5NvxcseNaR+VID6jevgVcPo7OS1g/Lyo0YUJLlUSpKQ8Gbh5CBS1+' +
'wTgR8GQDX+pEi+CMxWzBFWY/IcqxssKY/V/Tv7UM1hiIGs5ryZPuMMgvYKJobGjZ' +
'pFQZvAeGQf92NXaXkx2E08pnBq2eTYcu9OSEDSrB5POE/Tv9IRHpInHqqndOndRD' +
'DNtdZZo2ofULQeEVzN085kkqQ/jOCNKDboRqjewMTq98aZFPY9Bf1HKS0r8eBP0b' +
'BADNxb+lC/ffsic6eavtBHbPRLYVCfHAOLkBDQRU4155AQgA0dnRoKnEHw/cBvXX' +
'AkJk3tZkoGM3QWbGBHd47pmPHGJGD3VOqEFul5jAo5X0agxoP0FZsWbxXEriBefN' +
'1GH6ioMly67HdMktkqqJCZr4+qL5yESEhtzL5b8pqex4SGvpkj7VeIN99u+Kq5vj' +
'2InUkCr+UYVaXaFCdUIr0WQc68ZgztA0lOqbUPT75Ov+0fmr/hDpZPnr8jN4sEii' +
'1UkBBTtwYgONmOw/+UQPrxU6hKnecxgJtHEG3oQ+/kqEipfk0jueaD1/OJhjQmiA' +
'CgAz5MaHE0n+qChM+ZvKJO0UImr7yBGEqV+j/MpLc5K01gvQ8EUKX1HX46UkCPg2' +
'bK+b3wARAQABiQEfBBgBAgAJBQJU4155AhsMAAoJENNRH64I5fkziMwH/2sOLdH2' +
'6TAYjuvgaMHHO5j2EuZpXiePIqcFptk+fUPdc3B7K9CEn+NMorgCChd4W/G/8L6Q' +
'UhrUCec2MGNF2Ng3aEFAsS2IS1b4WtDW2K17HDemKBxq4StH8HJDibnxLwvKHcwr' +
'fhLKkYknZXKfA+/1jJknNDmFvPfk9LZzHw7BzZ9mcxgKN9sjwgwcyWL/pj4CPhGI' +
'uKzbF8gpS2A326yGLQ313jQpuAg6EJ5SSYoVWdlE4MZ8YfCFyFNWFL3PhiGsAd2W' +
'79Kw1al8jxwK0+oAIitfQ9aK9IFIPWWPOLq8AyBotdHN9WyT/RT0gCdQZGOWJx68' +
'1/57gCaY3rDSMK8=' +
'=c4NC' +
'----END PGP PUBLIC KEY BLOCK-----',
      pub_key = openpgp.key.readArmored(pub_key_text),
      encrypted_streams = {};
    

    function nodeBufferToUint8Array(buffer) {
      var array = new Uint8Array(ab);
      for (var i = 0; i < buffer.length; ++i) {
          array[i] = buffer[i];
      }
      return array;
    }
    
    function encryptedFileStream(file, pub_keys) {
      this.buffer = new Buffer([], 'binary');
      this.file = file;
      this.message_stream = openpgp.stream.MessageStream(pub_keys, file.size,
                                                         file.name);
      this.message_stream.on('data', this.on_data);
      this.message_stream.on('end', this.on_end);
    };

    encryptedFileStream.prototype.on_data = function(data) {
      this.buffer = Buffer.concat([this.buffer, data]);
    };

    encryptedFileStream.prototype.on_end = function(data) {
    };

    encryptedFileStream.prototype.read = function(chunk, startByte, endByte, fileType) {
      var neededBytes = (endByte - startByte) - this.buffer.length,
        self = this,
        reader = new FileReader(),
        file = chunk.fileObj.file;

      this.message_stream.on('data', function(data) {
        if (neededBytes >= this.buffer.length) {
          var data = new Blob(nodeBufferToUint8Array(this.buffer.slice(0, neededBytes)));
          // Investigate if this de-allocates the bytes automatically or not
          this.buffer = this.buffer.slice(neededBytes);
          self.chunk.readFinished(data);
        }
      });
      this.message_stream.on('end', function(data) {
          self.chunk.readFinished(new Blob(nodeBufferToUint8Array(this.buffer)));
      });
      
      reader.onload = function(e) {
        self.message_stream.write(e.target.result); 
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
        var encrypted_file_stream = new encryptedFileStream(chunk.fileObj, [pub_key]);
        chunk.fileObj.encrypted_file_stream = encrypted_file_stream;
        chunk.fileObj.size = encrypted_file_stream.message_stream.size;
        chunk.preprocessFinished();
      },
      read: function(chunk, startByte, endByte, fileType) {
        chunk.fileObj.encrypted_file_stream(chunk, startByte, endByte, fileType);
      }
    }
  });
