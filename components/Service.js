Components.utils.import('resource://digest/common.jsm');
Components.utils.import('resource://gre/modules/Services.jsm');
Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');

IMPORT_COMMON(this);

function BriefService() {
    // Initialize Storage module.
    Components.utils.import('resource://digest/Storage.jsm');

    // Registers %profile%/chrome directory under a resource URI.
    let resourceProtocolHandler = Services.io.getProtocolHandler('resource')
                                             .QueryInterface(Ci.nsIResProtocolHandler);
    if (!resourceProtocolHandler.hasSubstitution('profile-chrome-dir')) {
        let chromeDir = Services.dirsvc.get('ProfD', Ci.nsIFile);
        chromeDir.append('chrome');
        let chromeDirURI = Services.io.newFileURI(chromeDir);
        resourceProtocolHandler.setSubstitution('profile-chrome-dir', chromeDirURI);
    }
}

BriefService.prototype = {

    // mozIStorageVacuumParticipant
    get databaseConnection() {
        return Components.utils.getGlobalForObject(Storage).Connection._nativeConnection;
    },

    // mozIStorageVacuumParticipant
    expectedDatabasePageSize: Ci.mozIStorageConnection.DEFAULT_PAGE_SIZE,

    // mozIStorageVacuumParticipant
    onBeginVacuum: function onBeginVacuum() {
        Components.utils.import('resource://digest/FeedUpdateService.jsm');
        FeedUpdateService.stopUpdating();

        return true;
    },

    // mozIStorageVacuumParticipant
    onEndVacuum: function onEndVacuum(aSucceeded) {

    },

    // nsIObserver
    observe: function() {

    },

    classDescription: 'Service of Digest extension',
    classID: Components.ID('{7be39418-cdae-4f37-8c97-ae5323954682}'),
    contractID: '@brief.mozdev.org/briefservice;1',
    QueryInterface: XPCOMUtils.generateQI([Ci.nsIObserver,
                                           Ci.mozIStorageVacuumParticipant])

}

let NSGetFactory = XPCOMUtils.generateNSGetFactory([BriefService]);
