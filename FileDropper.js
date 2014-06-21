/*

TODO

* onchange fallback
* file type validation
* multiple
* classnames

*/

function FileDropper(element, settings) {
    var that = this;

    that.element = element;
    that.settings = settings;

    that.element.ondragover = function() {
        return false;
    };

    that.element.ondragleave = function() {
        return false;
    };

    that.element.ondrop = function(event) {
        event.preventDefault();

        var files = event.dataTransfer.files;

        if (validateFiles(files)) {
            if (that.settings.onComplete) {
                that.settings.onComplete(files);
            }
        }
    };

    that.element.onchange = function() {};

    /**
     * Files validation
     */
    function validateFiles(files) {
        var errors = [];

        /* File size */
        for (var i = 0; i < files.length; i++) {
            if (files[i].size > that.settings.maxFileSize) {
                errors.push({
                    code: 1,
                    message: files[i].name + ' is too large'
                });
            }
        }

        if (errors.length) {
            if (that.settings.onError) {
                that.settings.onError(errors);
            } else {
                for (var i = 0; i < errors.length; i++) {
                    throw new Error(errors[i].message);
                }
            }
        }

        return !errors.length;
    };
}

FileDropper.prototype.settings = {
    maxFileSize: 1024 * 1024
};

if (window.jQuery) {
    (function($) {
        $.fn.FileDropper = function(options) {
            this.each(function() {
                new FileDropper(this, options);
            });

            return this;
        };
    })(window.jQuery);
}