/* NPM */
import React from 'react';

/* App */
import AddDiffs from './AddDiffs';
import BuyDiffs from './BuyDiffs';
import ChangeOwner from './ChangeOwner';
import ChangePassword from './ChangePassword';
import EditDiff from './EditDiff';
import SaveDiffView from './SaveDiffView';
import ShareDiffView from './ShareDiffView';
import DeleteDiff from './DeleteDiff';
import DiffInfo from './DiffInfo';

import UploadScan from './UploadScan';
import AssociateScan from './AssociateScan';
import EditScan from './EditScan';
import DeleteScan from './DeleteScan';
import ScanInfo from './ScanInfo';
// import ChangeOwner from './ChangeOwner';
// import CreateReport from './CreateReport';
// import MoreInfo from './MoreInfo';
// import Share from './Share';
import UploadModel from './UploadModel';
import EditModel from './EditModel';
import DeleteModel from './DeleteModel';
import ModelInfo from './ModelInfo';
// import UnassociatedScan from './UnassociatedScan';

import CreateProject from './CreateProject';
import EditProject from './EditProject';
import DeleteProject from './DeleteProject';

import CreateAccount from './CreateAccount';
import EditAccount from './EditAccount';
import Profile from './Profile';
import UploadsStatus from './UploadsStatus';
import UploadThumb from './UploadThumb';
import Features from './Features';
import AugmentedFiles from './AugmentedFiles';
import ShareAccount from './ShareAccount';
import ShareProject from './ShareProject';
import Invitations from './Invitations';
/*
    <ChangeOwner />
    <CreateReport />
    <EditScan />
    <EditModel />
    <MoreInfo />
    <Share />
    <UnassociatedScan />

*/
const Modals = () => (
  <React.Fragment>
    <AddDiffs />
    <BuyDiffs />
    <ChangeOwner />
    <ChangePassword />
    <EditDiff />
    <SaveDiffView />
    <ShareDiffView />
    <DeleteDiff />
    <DiffInfo />

    <UploadScan />
    <AssociateScan />
    <EditScan />
    <DeleteScan />
    <ScanInfo />

    <UploadModel />
    <EditModel />
    <DeleteModel />
    <ModelInfo />

    <CreateProject />
    <EditProject />
    <DeleteProject />

    <CreateAccount />
    <EditAccount />
    <Profile />
    <UploadsStatus />
    <UploadThumb />

    <Features />
    <AugmentedFiles />
    <ShareAccount />
    <ShareProject />
    <Invitations />
  </React.Fragment>
);

export default Modals;
