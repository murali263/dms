import { SDBaseService } from 'app/n-services/SDBaseService';
//CORE_REFERENCE_IMPORTS
//CORE_REFERENCE_IMPORT-emailbot
import { emailbot } from '../sd-services/emailbot';
//CORE_REFERENCE_IMPORT-reports
import { reports } from '../sd-services/reports';
//CORE_REFERENCE_IMPORT-dmsstatus
import { dmsstatus } from '../sd-services/dmsstatus';
//CORE_REFERENCE_IMPORT-approvalsection
import { approvalsection } from '../sd-services/approvalsection';
//CORE_REFERENCE_IMPORT-dmsconfiguration
import { dmsconfiguration } from '../sd-services/dmsconfiguration';
//CORE_REFERENCE_IMPORT-dmsusers
import { dmsusers } from '../sd-services/dmsusers';
import { ScrollDispatcher } from '@angular/cdk/scrolling';

export const sdProviders = [
  SDBaseService,
  //CORE_REFERENCE_PUSH_TO_SD_ARRAY
  //CORE_REFERENCE_PUSH_TO_SD_ARRAY-emailbot
  emailbot,
  //CORE_REFERENCE_PUSH_TO_SD_ARRAY-reports
  reports,
  //CORE_REFERENCE_PUSH_TO_SD_ARRAY-dmsstatus
  dmsstatus,
  //CORE_REFERENCE_PUSH_TO_SD_ARRAY-approvalsection
  approvalsection,
  //CORE_REFERENCE_PUSH_TO_SD_ARRAY-dmsconfiguration
  dmsconfiguration,
  //CORE_REFERENCE_PUSH_TO_SD_ARRAY-dmsusers
  dmsusers,
  ScrollDispatcher
];
