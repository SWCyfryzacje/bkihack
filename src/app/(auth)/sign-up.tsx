import FormScreen from '@/components/form/form-screen';
import AuthHeader from '@/components/form/auth-header';
import AuthLink from '@/components/form/auth-link';
import FormError from '@/components/form/form-error';
import FormInfo from '@/components/form/form-info';
import PrimaryButton from '@/components/form/primary-button';
import NameFields from '@/components/register/name-fields';
import CredentialsFields from '@/components/register/credentials-fields';
import AreaPicker from '@/components/register/area-picker';
import { useRegister } from '@/components/register/use-register';

export default function Register() {
  const { form, set, errors, submitError, info, loading, submit } =
    useRegister();

  return (
    <FormScreen>
      <AuthHeader
        title='Dołącz do Wotum'
        subtitle='Załóż konto i głosuj w sprawach swojego osiedla.'
      />
      <FormError message={submitError} />
      <FormInfo message={info} />
      <NameFields
        {...form}
        onChange={set}
        errors={errors}
      />
      <CredentialsFields
        {...form}
        onChange={set}
        errors={errors}
      />
      <AreaPicker
        value={form.areaId}
        onChange={(id) => set('areaId', id)}
        error={errors.areaId}
      />
      <PrimaryButton
        title='Zarejestruj się'
        onPress={submit}
        loading={loading}
      />
      <AuthLink
        prompt='Masz już konto?'
        label='Zaloguj się'
        href='/(auth)/sign-in'
      />
    </FormScreen>
  );
}
