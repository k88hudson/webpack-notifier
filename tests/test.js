var WNP = require('../index');
var assert = require('assert');

const DEFAULT_OPTIONS = JSON.parse(JSON.stringify(WNP.DEFAULT_OPTIONS));

describe('WebpackNotifierPlugin', function () {

  it('should create the right default events', function () {
    var wnp = new WNP();
    assert.deepEqual(wnp.events, {
      error: DEFAULT_OPTIONS,
      warning: DEFAULT_OPTIONS,
      rebuild: false,
      success: {
        title: DEFAULT_OPTIONS.title,
        contentImage: DEFAULT_OPTIONS.contentImage,
        message: 'Build successful'
      }
    })
  });

  it('should allow an event to be overridden', function () {
    var wnp = new WNP({
      error: {
        title: 'Error'
      }
    });
    assert.deepEqual(wnp.events, {
      error: {
        title: 'Error',
        contentImage: DEFAULT_OPTIONS.contentImage
      },
      warning: DEFAULT_OPTIONS,
      rebuild: false,
      success: {
        title: DEFAULT_OPTIONS.title,
        contentImage: DEFAULT_OPTIONS.contentImage,
        message: 'Build successful'
      }
    })
  });

  describe('#prepareDefaults', function () {
    it('should generate defaults for empty case', function () {
      assert.deepEqual(WNP.prototype.prepareDefaults(), {
        error: DEFAULT_OPTIONS,
        warning: DEFAULT_OPTIONS,
        rebuild: false,
        success: {
          title: DEFAULT_OPTIONS.title,
          contentImage: DEFAULT_OPTIONS.contentImage,
          message: 'Build successful'
        }
      });
    });

    it('should allow an event to remain false if defined', function () {
      assert.deepEqual(WNP.prototype.prepareDefaults({
        warning: false
      }), {
        error: DEFAULT_OPTIONS,
        warning: false,
        rebuild: false,
        success: {
          title: DEFAULT_OPTIONS.title,
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
        error: DEFAULT_OPTIONS,
        warning: DEFAULT_OPTIONS,
        success: {
          title: 'Webpack success',
          sound: true,
          contentImage: DEFAULT_OPTIONS.contentImage,
          message: 'Build successful'
        },
        rebuild: false
      });
    });

    it('should extend defaults that are false with global defaults', function () {
      assert.deepEqual(WNP.prototype.prepareDefaults({
        rebuild: true
      }), {
        error: DEFAULT_OPTIONS,
        warning: DEFAULT_OPTIONS,
        success: {
          title: 'Webpack',
          contentImage: DEFAULT_OPTIONS.contentImage,
          message: 'Build successful'
        },
        rebuild: DEFAULT_OPTIONS
      });
      assert.deepEqual(WNP.prototype.prepareDefaults({
        rebuild: {
          message: 'Build successful'
        }
      }), {
        error: DEFAULT_OPTIONS,
        warning: DEFAULT_OPTIONS,
        success: {
          title: 'Webpack',
          contentImage: DEFAULT_OPTIONS.contentImage,
          message: 'Build successful'
        },
        rebuild: {
          title: 'Webpack',
          contentImage: DEFAULT_OPTIONS.contentImage,
          message: 'Build successful'
        }
      });
    });

  });

});
