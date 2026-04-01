'use server'
import { AuthService } from '@/services/AuthService'

const Personal = async() => {
  const user=await  AuthService.Server();
  user.getUsers().then(res=>console.log(res))
  return (
    <section className="flex size-full flex-col gap-10 text-white">
        <h1 className='text-3xl fold-bold'>
            Personal
        </h1>

    </section>
  )
}

export default Personal
