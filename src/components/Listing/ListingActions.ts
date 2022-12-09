import { CustomTableEditionEvent } from '@/components/CustomTable/CustomTableTypes';
import { RequestConfig } from '@/types';
import { Emit, Vue } from 'vue-property-decorator';

export default abstract class ListingActions extends Vue {
	@Emit('change:cell')
	protected changeCell(payload?: CustomTableEditionEvent): void {
		return;
	}
	@Emit('delete:row')
	protected deleteRow(): void {
		return;
	}
	@Emit('post')
	protected post(payload?: RequestConfig): void {
		return;
	}
	@Emit('put')
	protected put(payload?: RequestConfig): void {
		return;
	}
	@Emit('patch')
	protected patch(payload?: RequestConfig): void {
		return;
	}
	@Emit('delete')
	protected delete(payload?: RequestConfig): void {
		return;
	}
	@Emit('togglesubtable')
	protected togglesubtable(): void {
		return;
	}
	@Emit('componentevent')
	protected componentevent(payload?: any): void {
		return;
	}
}
