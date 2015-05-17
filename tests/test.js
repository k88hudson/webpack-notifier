var WNP = require('../index');
var assert = require('assert');

describe('WebpackNotifierPlugin', function () {

  describe('#prepareDefaults', function () {
    it('should generate defaults for empty case', function () {
      assert.deepEqual(WNP.prototype.prepareDefaults(), {
        error: WNP.DEFAULT_OPTIONS,
        warning: WNP.DEFAULT_OPTIONS,
        rebuild: false,
        success: {
          title: WNP.DEFAULT_OPTIONS.title,
          contentImage: WNP.DEFAULT_OPTIONS.contentImage,
          message: 'Build successful'
        }
      });
    });

    it('should allow an event to remain false if defined', function () {
      assert.deepEqual(WNP.prototype.prepareDefaults({
        warning: false
      }), {
        error: WNP.DEFAULT_OPTIONS,
        warning: false,
        rebuild: false,
        success: {
          title: WNP.DEFAULT_OPTIONS.title,
          contentImage: WNP.DEFAULT_OPTIONS.contentImage,
          message: 'Build successful'
        }
      });
    });

    it('should extend defaults for defined events', function () {
      assert.deepEqual(WNP.prototype.prepareDefaults({
        success: {
          title: 'Webpack success',
          sound: true
        }
      }), {
        error: WNP.DEFAULT_OPTIONS,
        warning: WNP.DEFAULT_OPTIONS,
        success: {
          title: 'Webpack success',
          sound: true,
          contentImage: WNP.DEFAULT_OPTIONS.contentImage,
          message: 'Build successful'
        },
        rebuild: false
      });
    });

    it('should extend defaults that are false with global defaults', function () {
      assert.deepEqual(WNP.prototype.prepareDefaults({
        rebuild: true
      }), {
        error: WNP.DEFAULT_OPTIONS,
        warning: WNP.DEFAULT_OPTIONS,
        success: {
          title: 'Webpack',
          contentImage: WNP.DEFAULT_OPTIONS.contentImage,
          message: 'Build successful'
        },
        rebuild: WNP.DEFAULT_OPTIONS
      });
      assert.deepEqual(WNP.prototype.prepareDefaults({
        rebuild: {
          message: 'Build successful'
        }
      }), {
        error: WNP.DEFAULT_OPTIONS,
        warning: WNP.DEFAULT_OPTIONS,
        success: {
          title: 'Webpack',
          contentImage: WNP.DEFAULT_OPTIONS.contentImage,
          message: 'Build successful'
        },
        rebuild: {
          title: 'Webpack',
          contentImage: WNP.DEFAULT_OPTIONS.contentImage,
          message: 'Build successful'
        }
      });
    });

  });

});
