uitest.require(["factory!documentUtils"], function(documentUtilsFactory) {
    describe('documentUtils', function() {
        var documentUtils;
        beforeEach(function() {
            documentUtils = documentUtilsFactory();
        });

        describe('serializeDocType', function() {
            function doctype(html) {
                return documentUtils.serializeDocType(testutils.createFrame(html).win.document);
            }
            it('should return empty string if no doctype is given', function() {
                expect(doctype('<html></html>')).toBe('');
            });
            it('should serialize html5 doctype', function() {
                expect(doctype('<!DOCTYPE html><html></html>')).toBe('<!DOCTYPE html>');
            });
        });

        describe('rewriteDocument', function() {
            function rewrite(html) {
                var frame = testutils.createFrame('<html></html>').win;
                documentUtils.rewriteDocument(frame, html);
                return frame.document;
            }
            it('should replace the document, including the root element and doctype', function() {
                var doc = rewrite('<!DOCTYPE html><html test="true"></html>');
                expect(doc.documentElement.getAttribute("test")).toBe("true");
                expect(doc.doctype.name).toBe('html');
            });
        });

        describe('replaceScripts', function() {
            var callback;
            beforeEach(function() {
                callback = jasmine.createSpy('callback');
            });
            it('should replace inline scripts', function() {
                var someReplacement = 'someReplacement';
                callback.andReturn(someReplacement);
                var result = documentUtils.replaceScripts('<script>a</script>', callback);
                expect(callback.callCount).toBe(1);
                expect(callback).toHaveBeenCalledWith(undefined, 'a');
            });
            it('should replace scripts if the result is not undefined', function() {
                var someReplacement = 'someReplacement';
                callback.andReturn(someReplacement);
                expect(documentUtils.replaceScripts('<script>a</script>', callback)).toBe(someReplacement);
            });
            it('should not replace scripts if the result is undefined', function() {
                var input = '<script>a</script>';
                expect(documentUtils.replaceScripts(input, callback)).toBe(input);
            });
            it('should replace multiple inline scripts', function() {
                documentUtils.replaceScripts('<script>a</script><script>b</script>', callback);
                expect(callback.callCount).toBe(2);
                expect(callback.argsForCall[0]).toEqual([undefined, 'a']);
                expect(callback.argsForCall[1]).toEqual([undefined, 'b']);
            });
            it('should replace multi line inline scripts', function() {
                var content = 'a\r\nb';
                documentUtils.replaceScripts('<script>' + content + '</script>', callback);
                expect(callback).toHaveBeenCalledWith(undefined, content);
            });
        });
    });
});