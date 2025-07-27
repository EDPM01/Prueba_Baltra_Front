import Layout from '@/app/components/layout/Layout';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Users, UserPlus } from 'lucide-react';

export default function Groups() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Grupos</h1>
            <p className="text-gray-600">Administra tus grupos de contactos</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Grupos de Contactos
            </CardTitle>
            <CardDescription>
              En las siguientes fases implementaremos la gestión completa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Gestión en desarrollo
              </h3>
              <p className="text-gray-500 mb-4">
                La gestión de grupos se implementará en fases posteriores
              </p>
              <Button variant="outline">
                Próximamente...
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
