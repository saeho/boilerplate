import { useMutation } from './apiClient';
import { savePlatformAuthToken } from '../../lib/platform';

/**
 * Compose; authenticate API
 */

function composeAuthenticate(Cmp: React.FC<any>) {
  return function AuthenticateCmp(p: any) {

    const { dispatchApp } = p;
    const [authenticate, { mutating }, dispatchData] = useMutation('authenticate', {
      onCompleted: (data: any, error: any) => {
        if (data.auth?.token) {

          savePlatformAuthToken(data.auth.token);

          dispatchData({
            __type: 'DATA_TOKEN',
            data: {
              authToken: data.auth.token,
            }
          });

          dispatchApp({
            __type: 'APP_AUTH',
            data
          });
        }
      }
    });

    return <Cmp
      {...p}
      authenticate={authenticate}
      mutating={mutating}
      notReady
    />;
  }
}

export default composeAuthenticate;
