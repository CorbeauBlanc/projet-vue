import { InputOption } from '@/components/Inputs/InputsTypes';
import Modal from '@/components/Modal/Modal';

export interface DynamicTabsConfig {
	tabOptions: (InputOption | string)[];
	deleteModal?: Modal;
}
