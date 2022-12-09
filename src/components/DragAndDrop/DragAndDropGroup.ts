import Logger from '@/services/LoggerService';
import { Vue } from 'vue-property-decorator';

export default class DragAndDropGroup extends Vue {
	protected dragStarted: boolean = false;
	protected collection: any[] = [];

	protected insertElement(srcIndex: number, destIndex: number): void {
		this.dragStarted = false;
		if (srcIndex === destIndex)
			return Logger.dbgLog(
				'DragAndDropGroup: insertElement: srcIndex is equal to destIndex',
				this
			);
		this.collection.splice(destIndex + 1, 0, this.collection[srcIndex]);
		this.collection.splice(
			srcIndex > destIndex ? srcIndex + 1 : srcIndex,
			1
		);
	}

	protected deleteElement(index: number): void {
		this.collection.splice(index, 1);
	}
}
